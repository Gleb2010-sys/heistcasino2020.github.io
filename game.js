let yaGames;
(async () => {
    try {
        yaGames = await YaGames.create();
        await yaGames.initializeSdk();
        
        yaGames.adv.showFullscreenAdv();
    } catch (error) {
        console.error('Failed to initialize Yandex Games SDK:', error);
    }
})();

let gold = 0;
let goldPerClick = 1;
let goldPerSecond = 0;
let multiplier = 1;
let prestigeLevel = 1;
let adsWatched = {
    perClick10: 0,
    perClick20: 0,
    perClick30: 0
};

const clickUpgrades = [
    { basePrice: 25, increment: 1, count: 0, maxCount: 11, name: "+1 за клик" },
    { basePrice: 100, increment: 3, count: 0, maxCount: 10, name: "+3 за клик" },
    { basePrice: 10000, increment: 10, count: 0, maxCount: 9, name: "+10 за клик" },
    { basePrice: 100000, increment: 30, count: 0, maxCount: 8, name: "+30 за клик" },
    { basePrice: 250000, increment: 100, count: 0, maxCount: 7, name: "+100 за клик" },
    { basePrice: 1000000, increment: 200, count: 0, maxCount: 6, name: "+200 за клик" },
    { basePrice: 10000000, increment: 500, count: 0, maxCount: 5, name: "+500 за клик" },
    { basePrice: 100000000, increment: 1000, count: 0, maxCount: 4, name: "+1000 за клик" },
    { basePrice: 1000000000, increment: 10000, count: 0, maxCount: 3, name: "+10K за клик" }
];

const secondUpgrades = [
    { basePrice: 25, increment: 0.3, count: 0, maxCount: 15, name: "+0.3 в секунду" },
    { basePrice: 100, increment: 0.6, count: 0, maxCount: 14, name: "+0.6 в секунду" },
    { basePrice: 1000, increment: 1.2, count: 0, maxCount: 13, name: "+1.2 в секунду" },
    { basePrice: 10000, increment: 2.5, count: 0, maxCount: 12, name: "+2.5 в секунду" },
    { basePrice: 100000, increment: 5, count: 0, maxCount: 11, name: "+5 в секунду" },
    { basePrice: 1000000, increment: 10, count: 0, maxCount: 10, name: "+10 в секунду" },
    { basePrice: 10000000, increment: 25, count: 0, maxCount: 9, name: "+25 в секунду" },
    { basePrice: 100000000, increment: 50, count: 0, maxCount: 8, name: "+50 в секунду" },
    { basePrice: 1000000000, increment: 100, count: 0, maxCount: 7, name: "+100 в секунду" }
];

const imageThresholds = [
    100000,
    1000000,
    100000000,
    1000000000,
    10000000000,
    100000000000,
    1000000000000,
    10000000000000,
    100000000000000,
    1000000000000000
];

const levelImages = [
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135792.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135795.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135798.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135800.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135803.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135806.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135809.png"
];

const goldElement = document.getElementById('gold');
const perSecondDisplay = document.getElementById('perSecondDisplay');
const multiplierElement = document.getElementById('multiplier');
const mainImage = document.getElementById('mainImage');
const clickEffect = document.getElementById('clickEffect');
const prestigeModal = document.getElementById('prestigeModal');
const itemsContainer = document.getElementById('itemsContainer');
const perSecondBtn = document.getElementById('perSecondBtn');
const perClickBtn = document.getElementById('perClickBtn');
const shopBtn = document.getElementById('shopBtn');
const prestigeBtn = document.getElementById('prestigeBtn');
const confirmPrestige = document.getElementById('confirmPrestige');
const cancelPrestige = document.getElementById('cancelPrestige');
const currentMultiplier = document.getElementById('currentMultiplier');
const nextMultiplier = document.getElementById('nextMultiplier');
const prestigeCost = document.getElementById('prestigeCost');

const drawerOverlay = document.getElementById('drawerOverlay');
const drawer = document.getElementById('drawer');
const drawerHeader = document.getElementById('drawerHeader');
const drawerTitle = document.getElementById('drawerTitle');

let activeShop = null;
let isDrawerOpen = false;

function formatNumber(num) {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Qd';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

function updateGoldDisplay() {
    goldElement.textContent = formatNumber(gold);
    
    perSecondDisplay.textContent = `+${formatNumber(goldPerSecond)}/сек`;
    
    if (multiplier > 1) {
        multiplierElement.textContent = `${multiplier}X`;
        multiplierElement.style.display = 'block';
    } else {
        multiplierElement.style.display = 'none';
    }
    
    updateMainImage();
}

function updateMainImage() {
    let imageIndex = 0;
    for (let i = imageThresholds.length - 1; i >= 0; i--) {
        if (gold >= imageThresholds[i]) {
            imageIndex = i + 1;
            break;
        }
    }
    mainImage.src = levelImages[imageIndex];
}

function showClickEffect(amount, x, y) {
    clickEffect.textContent = `+${formatNumber(amount)}`;
    clickEffect.style.left = `${x}px`;
    clickEffect.style.top = `${y}px`;
    clickEffect.style.opacity = '1';
    clickEffect.style.animation = 'none';
    
    requestAnimationFrame(() => {
        clickEffect.style.animation = 'floatUp 1s ease-out';
    });
    
    setTimeout(() => {
        clickEffect.style.opacity = '0';
    }, 1000);
}

mainImage.addEventListener('click', (e) => {
    const rect = mainImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const actualGoldPerClick = goldPerClick * multiplier;
    gold += actualGoldPerClick;
    
    showClickEffect(actualGoldPerClick, x, y);
    updateGoldDisplay();
    saveGame();
});

mainImage.addEventListener('mousedown', () => {
    mainImage.style.transform = 'scale(0.95)';
});

mainImage.addEventListener('mouseup', () => {
    mainImage.style.transform = 'scale(1)';
});

mainImage.addEventListener('mouseleave', () => {
    mainImage.style.transform = 'scale(1)';
});

mainImage.addEventListener('touchstart', () => {
    mainImage.style.transform = 'scale(0.95)';
});

mainImage.addEventListener('touchend', () => {
    mainImage.style.transform = 'scale(1)';
});

const shops = {
    perClick: {
        title: "Улучшения за клик",
        items: clickUpgrades.map((upgrade, index) => ({
            name: upgrade.name,
            description: `Даёт: +${formatNumber(upgrade.increment * multiplier)} за клик`,
            price: upgrade.basePrice * Math.pow(2, upgrade.count),
            count: upgrade.count,
            maxCount: upgrade.maxCount,
            remaining: upgrade.maxCount - upgrade.count,
            onClick: () => buyClickUpgrade(index)
        }))
    },
    
    perSecond: {
        title: "Улучшения в секунду",
        items: secondUpgrades.map((upgrade, index) => ({
            name: upgrade.name,
            description: `Даёт: +${formatNumber(upgrade.increment * multiplier)}/сек`,
            price: upgrade.basePrice * Math.pow(2, upgrade.count),
            count: upgrade.count,
            maxCount: upgrade.maxCount,
            remaining: upgrade.maxCount - upgrade.count,
            onClick: () => buySecondUpgrade(index)
        }))
    },
    
    shop: {
        title: "Магазин",
        items: [
            {
                name: "+10 за клик",
                description: "Даёт: +10 за клик",
                price: "Реклама",
                count: adsWatched.perClick10,
                maxCount: 1,
                remaining: 1 - adsWatched.perClick10,
                onClick: () => showAdForPerClick(10)
            },
            {
                name: "+20 за клик",
                description: "Даёт: +20 за клик",
                price: "2 Рекламы",
                count: adsWatched.perClick20,
                maxCount: 2,
                remaining: 2 - adsWatched.perClick20,
                onClick: () => showAdForPerClick(20)
            },
            {
                name: "+30 за клик",
                description: "Даёт: +30 за клик",
                price: "3 Рекламы",
                count: adsWatched.perClick30,
                maxCount: 3,
                remaining: 3 - adsWatched.perClick30,
                onClick: () => showAdForPerClick(30)
            }
        ]
    }
};

mainImage.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

mainImage.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

mainImage.setAttribute('draggable', 'false');

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
});

async function showAdForPerClick(amount) {
    try {
        if (yaGames) {
            await yaGames.adv.showRewardedVideo();
            
            switch (amount) {
                case 10:
                    adsWatched.perClick10++;
                    if (adsWatched.perClick10 >= 1) {
                        goldPerClick += 10 * multiplier;
                        adsWatched.perClick10 = 0;
                    }
                    break;
                case 20:
                    adsWatched.perClick20++;
                    if (adsWatched.perClick20 >= 2) {
                        goldPerClick += 20 * multiplier;
                        adsWatched.perClick20 = 0;
                    }
                    break;
                case 30:
                    adsWatched.perClick30++;
                    if (adsWatched.perClick30 >= 3) {
                        goldPerClick += 30 * multiplier;
                        adsWatched.perClick30 = 0;
                    }
                    break;
            }
            
            updateShopDisplay();
            updateGoldDisplay();
            saveGame();
        }
    } catch (error) {
        console.error('Error showing ad:', error);
    }
}

function buyClickUpgrade(index) {
    const upgrade = clickUpgrades[index];
    const price = upgrade.basePrice * Math.pow(2, upgrade.count);
    
    if (gold >= price && upgrade.count < upgrade.maxCount) {
        gold -= price;
        goldPerClick += upgrade.increment * multiplier;
        upgrade.count++;
        updateGoldDisplay();
        updateShopDisplay();
        saveGame();
    }
}

function buySecondUpgrade(index) {
    const upgrade = secondUpgrades[index];
    const price = upgrade.basePrice * Math.pow(2, upgrade.count);
    
    if (gold >= price && upgrade.count < upgrade.maxCount) {
        gold -= price;
        goldPerSecond += upgrade.increment * multiplier;
        upgrade.count++;
        updateGoldDisplay();
        updateShopDisplay();
        saveGame();
    }
}

function updateShopDisplay() {
    if (!activeShop) return;
    
    itemsContainer.innerHTML = '';
    const shop = shops[activeShop];
    
    shop.items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        const isDisabled = item.count >= item.maxCount || (typeof item.price === 'number' && gold < item.price);
        itemElement.className = `item ${isDisabled ? 'disabled' : ''}`;
        
        const priceText = typeof item.price === 'number' ? formatNumber(item.price) : item.price;
        const remainingText = item.remaining > 0 ? `Осталось: ${item.remaining}` : 'Максимум';
        
        itemElement.innerHTML = `
            <div class="item-left">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">Стоимость: ${priceText}</div>
                <div class="item-remaining">${remainingText}</div>
            </div>
            <div class="item-right">
                <div class="item-count">${item.count}/${item.maxCount}</div>
                ${activeShop === 'shop' ? 
                    `<img src="https://cdn-icons-png.flaticon.com/512/2721/2721264.png" class="ad-icon" alt="Реклама">` : 
                    ''
                }
            </div>
        `;
        
        if (!isDisabled) {
            itemElement.addEventListener('click', item.onClick);
        }
        
        itemsContainer.appendChild(itemElement);
    });
}

function openDrawer(shopName) {
    activeShop = shopName;
    drawerTitle.textContent = shops[shopName].title;
    updateShopDisplay();
    
    drawerOverlay.style.display = 'block';
    drawer.classList.add('open');
    
    setTimeout(() => {
        drawerOverlay.style.opacity = '1';
    }, 10);
    
    isDrawerOpen = true;
    
    perSecondBtn.classList.remove('active');
    perClickBtn.classList.remove('active');
    shopBtn.classList.remove('active');
    
    if (shopName === 'perSecond') perSecondBtn.classList.add('active');
    else if (shopName === 'perClick') perClickBtn.classList.add('active');
    else if (shopName === 'shop') shopBtn.classList.add('active');
}

function closeDrawer() {
    drawerOverlay.style.opacity = '0';
    drawer.classList.remove('open');
    drawer.style.transform = '';
    
    setTimeout(() => {
        drawerOverlay.style.display = 'none';
        perSecondBtn.classList.remove('active');
        perClickBtn.classList.remove('active');
        shopBtn.classList.remove('active');
    }, 300);
    
    isDrawerOpen = false;
}

let dragStartY = 0;
let currentY = 0;
let isDragging = false;

drawerHeader.addEventListener('touchstart', function(e) {
    if (!isDrawerOpen) return;
    
    dragStartY = e.touches[0].clientY;
    currentY = dragStartY;
    isDragging = true;
    drawer.style.transition = 'none';
    e.preventDefault();
}, { passive: false });

drawerHeader.addEventListener('mousedown', function(e) {
    if (!isDrawerOpen) return;
    
    dragStartY = e.clientY;
    currentY = dragStartY;
    isDragging = true;
    drawer.style.transition = 'none';
    e.preventDefault();
});

document.addEventListener('touchmove', function(e) {
    if (!isDragging || !isDrawerOpen) return;
    
    currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY;
    
    if (deltaY > 0) {
        drawer.style.transform = `translateY(${deltaY}px)`;
    }
}, { passive: false });

document.addEventListener('mousemove', function(e) {
    if (!isDragging || !isDrawerOpen) return;
    
    currentY = e.clientY;
    const deltaY = currentY - dragStartY;
    
    if (deltaY > 0) {
        drawer.style.transform = `translateY(${deltaY}px)`;
    }
});

document.addEventListener('touchend', function() {
    if (!isDragging) return;
    
    isDragging = false;
    const deltaY = currentY - dragStartY;
    drawer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    if (deltaY > 80) {
        closeDrawer();
    } else {
        drawer.style.transform = 'translateY(0)';
    }
});

document.addEventListener('mouseup', function() {
    if (!isDragging) return;
    
    isDragging = false;
    const deltaY = currentY - dragStartY;
    drawer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    if (deltaY > 80) {
        closeDrawer();
    } else {
        drawer.style.transform = 'translateY(0)';
    }
});

drawerOverlay.addEventListener('click', function(e) {
    if (e.target === drawerOverlay && isDrawerOpen) {
        closeDrawer();
    }
});

drawer.addEventListener('click', function(e) {
    e.stopPropagation();
});

perSecondBtn.addEventListener('click', () => openDrawer('perSecond'));
perClickBtn.addEventListener('click', () => openDrawer('perClick'));
shopBtn.addEventListener('click', () => openDrawer('shop'));

function showPrestigeModal() {
    const cost = 1e11 * Math.pow(3, prestigeLevel - 1);
    prestigeCost.textContent = formatNumber(cost);
    currentMultiplier.textContent = multiplier;
    nextMultiplier.textContent = multiplier + 1;
    prestigeModal.style.display = 'flex';
}

function confirmPrestigeAction() {
    const cost = 1e11 * Math.pow(3, prestigeLevel - 1);
    
    if (gold >= cost) {
        prestigeLevel++;
        multiplier++;
        gold = 0;
        goldPerClick = 1 * multiplier;
        goldPerSecond = 0;
        
        clickUpgrades.forEach(upgrade => upgrade.count = 0);
        secondUpgrades.forEach(upgrade => upgrade.count = 0);
        
        adsWatched.perClick10 = 0;
        adsWatched.perClick20 = 0;
        adsWatched.perClick30 = 0;
        
        updateGoldDisplay();
        prestigeModal.style.display = 'none';
        saveGame();
    }
}

function closePrestigeModal() {
    prestigeModal.style.display = 'none';
}

setInterval(() => {
    gold += goldPerSecond;
    updateGoldDisplay();
    saveGame();
}, 1000);

function saveGame() {
    const saveData = {
        gold,
        goldPerClick,
        goldPerSecond,
        multiplier,
        prestigeLevel,
        adsWatched,
        clickUpgrades,
        secondUpgrades
    };
    
    localStorage.setItem('tapGameSave', JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem('tapGameSave');
    if (saved) {
        try {
            const saveData = JSON.parse(saved);
            
            gold = saveData.gold || 0;
            goldPerClick = saveData.goldPerClick || 1;
            goldPerSecond = saveData.goldPerSecond || 0;
            multiplier = saveData.multiplier || 1;
            prestigeLevel = saveData.prestigeLevel || 1;
            adsWatched = saveData.adsWatched || { perClick10: 0, perClick20: 0, perClick30: 0 };
            
            if (saveData.clickUpgrades) {
                clickUpgrades.forEach((upgrade, i) => {
                    if (saveData.clickUpgrades[i]) {
                        upgrade.count = saveData.clickUpgrades[i].count || 0;
                    }
                });
            }
            
            if (saveData.secondUpgrades) {
                secondUpgrades.forEach((upgrade, i) => {
                    if (saveData.secondUpgrades[i]) {
                        upgrade.count = saveData.secondUpgrades[i].count || 0;
                    }
                });
            }
            
            updateGoldDisplay();
        } catch (e) {
            console.error('Error loading save:', e);
        }
    }
}

prestigeBtn.addEventListener('click', showPrestigeModal);
confirmPrestige.addEventListener('click', confirmPrestigeAction);
cancelPrestige.addEventListener('click', closePrestigeModal);

prestigeModal.addEventListener('click', (e) => {
    if (e.target === prestigeModal) closePrestigeModal();
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c' || e.key === 'i' || e.key === 'j' || e.key === 'p')) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
});

loadGame();

setInterval(saveGame, 30000);

setInterval(() => {
    if (yaGames && Math.random() < 0.5) {
        yaGames.adv.showFullscreenAdv();
    }
}, 300000);