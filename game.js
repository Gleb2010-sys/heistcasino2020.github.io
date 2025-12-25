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

let soundEnabled = true;
let sounds;
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

const SOUND_URLS = {
    CLICK: "video_2025-12-25_16-39-16 (online-audio-converter.com).m4a", 
    PURCHASE: "video_2025-12-25_16-39-16 (online-audio-converter.com).m4a"
};

const clickUpgrades = [
    { basePrice: 25, increment: 1, count: 0, maxCount: 11, name: "КЛИКЕР 1", description: "+1 за клик", imageIndex: 0 },
    { basePrice: 100, increment: 3, count: 0, maxCount: 10, name: "КЛИКЕР 2", description: "+3 за клик", imageIndex: 1 },
    { basePrice: 10000, increment: 10, count: 0, maxCount: 9, name: "КЛИКЕР 3", description: "+10 за клик", imageIndex: 2 },
    { basePrice: 100000, increment: 30, count: 0, maxCount: 8, name: "КЛИКЕР 4", description: "+30 за клик", imageIndex: 3 },
    { basePrice: 250000, increment: 100, count: 0, maxCount: 7, name: "КЛИКЕР 5", description: "+100 за клик", imageIndex: 4 },
    { basePrice: 1000000, increment: 200, count: 0, maxCount: 6, name: "КЛИКЕР 6", description: "+200 за клик", imageIndex: 5 },
    { basePrice: 10000000, increment: 500, count: 0, maxCount: 5, name: "КЛИКЕР 7", description: "+500 за клик", imageIndex: 6 },
    { basePrice: 100000000, increment: 1000, count: 0, maxCount: 4, name: "КЛИКЕР 8", description: "+1000 за клик", imageIndex: 7 },
    { basePrice: 1000000000, increment: 10000, count: 0, maxCount: 3, name: "КЛИКЕР 9", description: "+10K за клик", imageIndex: 8 }
];

const secondUpgrades = [
    { basePrice: 25, increment: 0.3, count: 0, maxCount: 15, name: "АВТО 1", description: "+0.3/сек", imageIndex: 0 },
    { basePrice: 100, increment: 0.6, count: 0, maxCount: 14, name: "АВТО 2", description: "+0.6/сек", imageIndex: 1 },
    { basePrice: 1000, increment: 1.2, count: 0, maxCount: 13, name: "АВТО 3", description: "+1.2/сек", imageIndex: 2 },
    { basePrice: 10000, increment: 2.5, count: 0, maxCount: 12, name: "АВТО 4", description: "+2.5/сек", imageIndex: 3 },
    { basePrice: 100000, increment: 5, count: 0, maxCount: 11, name: "АВТО 5", description: "+5/сек", imageIndex: 4 },
    { basePrice: 1000000, increment: 10, count: 0, maxCount: 10, name: "АВТО 6", description: "+10/сек", imageIndex: 5 },
    { basePrice: 10000000, increment: 25, count: 0, maxCount: 9, name: "АВТО 7", description: "+25/сек", imageIndex: 6 },
    { basePrice: 100000000, increment: 50, count: 0, maxCount: 8, name: "АВТО 8", description: "+50/сек", imageIndex: 7 },
    { basePrice: 1000000000, increment: 100, count: 0, maxCount: 7, name: "АВТО 9", description: "+100/сек", imageIndex: 8 }
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
    "https://iimg.su/s/25/ga8m5yPxXdOvvAZzYwh7LB8JLtwMgM96aQg8qNLH.png",
    "https://iimg.su/s/25/grXV5XdxAzYssiZqRUTc0zHPHbdsqBlZ660bgt5D.png",
    "https://iimg.su/s/25/gZs58pKx9k6dqwfIhFEeNYudz4rUqh7JzwLzwl2W.png",
    "https://iimg.su/s/25/giUNzAbxMNHd3yDgZgb9c9qnJpXg6byuZXjck4fs.png",
    "https://iimg.su/s/25/gUhOcQ8xNlciIRKedl7GjFEC2FCSJz2QUD30jvIp.png",
    "https://iimg.su/s/25/gZpmVObx5A4YbD9BBB7hO6LRAXPaAW2QaONSstyz.png",
    "https://iimg.su/s/25/g7KIZ22x0M4oWPwLTEo2Nj7FBjQU8dFMTTCfpNgr.png",
    "https://iimg.su/s/25/gYoWUg6x8hVEW8nlq3VaDDWtAFVkf0mdrzs5fLeM.png",
    "https://iimg.su/s/25/gu65IbzxL78BJYMkZqWL2WWUJeaw2qN9N3hzMhFo.png",
    "https://iimg.su/s/25/gSA2X7QxRLq1rMNepDaPHCEEvOKo7Hiqg7zoqUu6.png"
];

const clickUpgradeImages = [
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135720.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135725.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135730.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135735.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135740.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135745.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135750.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
];

const secondUpgradeImages = [
    "https://cdn-icons-png.flaticon.com/512/992/992700.png",
    "https://cdn-icons-png.flaticon.com/512/992/992701.png",
    "https://cdn-icons-png.flaticon.com/512/992/992702.png",
    "https://cdn-icons-png.flaticon.com/512/992/992703.png",
    "https://cdn-icons-png.flaticon.com/512/992/992704.png",
    "https://cdn-icons-png.flaticon.com/512/992/992705.png",
    "https://cdn-icons-png.flaticon.com/512/992/992706.png",
    "https://cdn-icons-png.flaticon.com/512/992/992707.png",
    "https://cdn-icons-png.flaticon.com/512/992/992708.png"
];

const shopImages = [
    "https://iimg.su/s/25/gqRxA5bxEizGkkz9yzt7pjaML2e6eSNFZzAjBHmi.png",
    "https://iimg.su/s/25/gtmPfnExe0evh0uQSZEbFGKOX99T0KZyRVSUnMKu.png",
    "https://iimg.su/s/25/glqaLUSxZkG8Gj9NfZN6QmqOKX9rG02YYRFakbg6.png"
];

const goldElement = document.getElementById('gold');
const perSecondDisplay = document.getElementById('perSecondDisplay');
const multiplierElement = document.getElementById('multiplier');
const tapTarget = document.getElementById('tapTarget');
const tapImage = document.querySelector('.tap-image');
const clickEffectContainer = document.getElementById('clickEffectContainer');
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
const soundBtn = document.getElementById('soundBtn');
const soundIcon = document.querySelector('.sound-icon');
const soundText = document.querySelector('.sound-text');

const drawerOverlay = document.getElementById('drawerOverlay');
const drawer = document.getElementById('drawer');
const drawerHeader = document.getElementById('drawerHeader');
const drawerTitle = document.getElementById('drawerTitle');

let activeShop = null;
let isDrawerOpen = false;
let activeTouches = new Set();
let shopItemsElements = {};

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
    
    const perSecondText = formatNumber(goldPerSecond);
    perSecondDisplay.textContent = `+${perSecondText}/сек`;
    
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
    tapImage.style.backgroundImage = `url('${levelImages[imageIndex]}')`;
}

function createClickEffect(clientX, clientY, amount) {
    const clickEffect = document.createElement('div');
    clickEffect.className = 'click-effect';

    clickEffect.style.position = 'fixed';
    clickEffect.style.left = `${clientX}px`;
    clickEffect.style.top = `${clientY}px`;
    clickEffect.style.transform = 'translate(-50%, -50%)';
    clickEffect.style.zIndex = '1000';
    
    const text = document.createElement('span');
    text.textContent = `+${formatNumber(amount)}`;
    
    const icon = document.createElement('div');
    icon.className = 'click-icon';
    
    clickEffect.appendChild(text);
    clickEffect.appendChild(icon);
    
    document.body.appendChild(clickEffect);
    
    clickEffect.style.opacity = '1';
    
    requestAnimationFrame(() => {
        clickEffect.style.transition = 'all 1s ease-out';
        clickEffect.style.transform = `translate(-50%, calc(-50% - 100px))`;
        clickEffect.style.opacity = '0';
    });

    setTimeout(() => {
        if (clickEffect.parentNode) {
            clickEffect.parentNode.removeChild(clickEffect);
        }
    }, 1000);
}

function handleTap(clientX, clientY) {
    const actualGoldPerClick = goldPerClick * multiplier;
    gold += actualGoldPerClick;

    if (sounds && sounds.playClickSound) {
        sounds.playClickSound();
    }
    
    createClickEffect(clientX, clientY, actualGoldPerClick);
    updateGoldDisplay();
    saveGame();
    
    tapImage.style.transform = 'scale(0.95)';
    setTimeout(() => {
        tapImage.style.transform = 'scale(1)';
    }, 100);
}

function showPurchaseAnimation(x, y) {
    const anim = document.createElement('div');
    anim.className = 'purchase-animation';
    anim.style.position = 'fixed';
    anim.style.left = `${x}px`;
    anim.style.top = `${y}px`;
    anim.style.width = '50px';
    anim.style.height = '50px';
    anim.style.zIndex = '2000';
    anim.style.pointerEvents = 'none';
    anim.style.backgroundImage = `url('https://iimg.su/s/25/ga8m5yPxXdOvvAZzYwh7LB8JLtwMgM96aQg8qNLH.png')`;
    anim.style.backgroundSize = 'contain';
    anim.style.backgroundRepeat = 'no-repeat';
    anim.style.backgroundPosition = 'center';
    
    document.body.appendChild(anim);
    
    setTimeout(() => {
        anim.remove();
    }, 800);
}

function preventImageSaving() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);
    
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);
    
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);
    
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c' || e.key === 'i' || e.key === 'j' || e.key === 'p' || e.key === 'a')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
    
    document.oncontextmenu = function() { return false; };
    
    const style = document.createElement('style');
    style.textContent = `
        .tap-image, .gold-icon, .prestige-icon, .menu-icon, .item-icon, .click-icon {
            pointer-events: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
        }
        * {
            -webkit-touch-callout: none !important;
        }
    `;
    document.head.appendChild(style);
}

function setupMultitouch() {
    let lastTapTime = 0;
    let tapCount = 0;
    
    function handleTap(x, y) {
        const actualGoldPerClick = goldPerClick * multiplier;
        gold += actualGoldPerClick;

        if (sounds && sounds.playClickSound) {
            sounds.playClickSound();
        }
        
        createClickEffect(x, y, actualGoldPerClick);
        updateGoldDisplay();
        saveGame();
        
        tapImage.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tapImage.style.transform = 'scale(1)';
        }, 100);
    }
    
    tapTarget.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handleTap(e.clientX, e.clientY);
    });
    
    tapTarget.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        handleTap(e.clientX, e.clientY);
        return false;
    });

    tapTarget.addEventListener('touchstart', (e) => {
        e.preventDefault();
        
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTime;

        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const rect = tapTarget.getBoundingClientRect();
            const x = touch.clientX;
            const y = touch.clientY;
            
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                handleTap(x, y);
            }
        }
        
        lastTapTime = now;
        tapCount++;
        
        tapImage.style.transform = 'scale(0.95)';
    }, { passive: false });
    
    tapTarget.addEventListener('touchend', (e) => {
        e.preventDefault();
        setTimeout(() => {
            tapImage.style.transform = 'scale(1)';
        }, 100);
    }, { passive: false });
    
    tapTarget.addEventListener('touchcancel', (e) => {
        tapImage.style.transform = 'scale(1)';
    });
    
    tapTarget.addEventListener('touchstart', (e) => {
        if (e.touches.length >= 2) {
            for (let i = 0; i < Math.min(e.touches.length, 5); i++) {
                const touch = e.touches[i];
                handleTap(touch.clientX, touch.clientY);
            }
        }
    }, { passive: false });
}

function initSounds() {
    const clickSound = new Audio(SOUND_URLS.CLICK);
    const purchaseSound = new Audio(SOUND_URLS.PURCHASE);
    
    clickSound.volume = 0.5;
    purchaseSound.volume = 0.5;
    
    clickSound.preload = 'auto';
    purchaseSound.preload = 'auto';
    
    sounds = {
        playClickSound: () => {
            if (soundEnabled) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log('Click sound error:', e));
            }
        },
        playPurchaseSound: () => {
            if (soundEnabled) {
                purchaseSound.currentTime = 0;
                purchaseSound.play().catch(e => console.log('Purchase sound error:', e));
            }
        }
    };
}

function initSoundButton() {
    if (soundBtn) {
        const savedSoundState = localStorage.getItem('tapGameSound');
        if (savedSoundState !== null) {
            soundEnabled = savedSoundState === 'true';
        }
        
        updateSoundButton();
        
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            updateSoundButton();
            localStorage.setItem('tapGameSound', soundEnabled);
        });
    }
}

function updateSoundButton() {
    if (soundBtn && soundIcon && soundText) {
        if (soundEnabled) {
            soundBtn.classList.remove('muted');
            soundIcon.style.backgroundImage = "url('https://iimg.su/s/25/gA5t7B7xR0j2YZrjoF2uEEkZovfjzsAIQE4scvFe.png')";
            soundText.textContent = 'Вкл';
        } else {
            soundBtn.classList.add('muted');
            soundIcon.style.backgroundImage = "url('https://iimg.su/s/25/g2abqlDx8gjqBzussyCTgSt4EhqqRuIrXLlBRszz.png')";
            soundText.textContent = 'Выкл';
        }
    }
}

const shops = {
    perClick: {
        title: "УЛУЧШЕНИЯ ЗА КЛИК",
        items: clickUpgrades.map((upgrade, index) => ({
            name: upgrade.name,
            description: upgrade.description,
            price: upgrade.basePrice,
            count: () => upgrade.count,
            maxCount: upgrade.maxCount,
            imageUrl: clickUpgradeImages[upgrade.imageIndex],
            onClick: (e) => buyClickUpgrade(index, e)
        }))
    },
    
    perSecond: {
        title: "УЛУЧШЕНИЯ В СЕКУНДУ",
        items: secondUpgrades.map((upgrade, index) => ({
            name: upgrade.name,
            description: upgrade.description,
            price: upgrade.basePrice,
            count: () => upgrade.count,
            maxCount: upgrade.maxCount,
            imageUrl: secondUpgradeImages[upgrade.imageIndex],
            onClick: (e) => buySecondUpgrade(index, e)
        }))
    },
    
    shop: {
        title: "МАГАЗИН БОНУСОВ",
        items: [
            {
                name: "БОНУС",
                description: "+10 за клик",
                price: "Реклама",
                count: () => adsWatched.perClick10,
                maxCount: 1,
                imageUrl: shopImages[0],
                onClick: (e) => showAdForPerClick(10, e)
            },
            {
                name: "БОНУС",
                description: "+20 за клик",
                price: "Реклама",
                count: () => adsWatched.perClick20,
                maxCount: 2,
                imageUrl: shopImages[1],
                onClick: (e) => showAdForPerClick(20, e)
            },
            {
                name: "БОНУС",
                description: "+30 за клик",
                price: "Реклама",
                count: () => adsWatched.perClick30,
                maxCount: 3,
                imageUrl: shopImages[2],
                onClick: (e) => showAdForPerClick(30, e)
            }
        ]
    }
};

async function showAdForPerClick(amount, e) {
    try {
        if (yaGames) {
            if (sounds && sounds.playPurchaseSound) {
                sounds.playPurchaseSound();
            }
            
            showPurchaseAnimation(e.clientX, e.clientY);
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

function buyClickUpgrade(index, e) {
    const upgrade = clickUpgrades[index];
    const price = upgrade.basePrice;
    
    if (gold >= price && upgrade.count < upgrade.maxCount) {
        if (sounds && sounds.playPurchaseSound) {
            sounds.playPurchaseSound();
        }
        
        showPurchaseAnimation(e.clientX, e.clientY);
        gold -= price;
        goldPerClick += upgrade.increment * multiplier;
        upgrade.count++;
        
        updateShopDisplay();
        updateGoldDisplay();
        saveGame();
    }
}

function buySecondUpgrade(index, e) {
    const upgrade = secondUpgrades[index];
    const price = upgrade.basePrice;
    
    if (gold >= price && upgrade.count < upgrade.maxCount) {
        if (sounds && sounds.playPurchaseSound) {
            sounds.playPurchaseSound();
        }
        
        showPurchaseAnimation(e.clientX, e.clientY);
        gold -= price;
        goldPerSecond += upgrade.increment * multiplier;
        upgrade.count++;
        
        updateShopDisplay();
        updateGoldDisplay();
        saveGame();
    }
}

function updateShopDisplay() {
    if (!activeShop) return;
    
    itemsContainer.innerHTML = '';
    const shop = shops[activeShop];
    
    shop.items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        const isDisabled = item.count() >= item.maxCount || (typeof item.price === 'number' && gold < item.price);
        itemElement.className = `item ${isDisabled ? 'disabled' : ''}`;
        
        const priceText = typeof item.price === 'number' ? formatNumber(item.price) : item.price;
        const currentCount = item.count();
        
        itemElement.innerHTML = `
            <div class="item-left">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">${priceText}</div>
            </div>
            <div class="item-right">
                <div class="purchase-counter">
                    <span class="counter-current">${currentCount}</span>
                    <span class="counter-separator">/</span>
                    <span class="counter-max">${item.maxCount}</span>
                </div>
                <div class="item-icon" style="background-image: url('${item.imageUrl}')"></div>
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
        soundEnabled,
        adsWatched,
        clickUpgrades: clickUpgrades.map(u => ({ 
            count: u.count,
            imageIndex: u.imageIndex 
        })),
        secondUpgrades: secondUpgrades.map(u => ({ 
            count: u.count,
            imageIndex: u.imageIndex 
        }))
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
            soundEnabled = saveData.soundEnabled !== undefined ? saveData.soundEnabled : true;
            adsWatched = saveData.adsWatched || { perClick10: 0, perClick20: 0, perClick30: 0 };
            
            if (saveData.clickUpgrades) {
                saveData.clickUpgrades.forEach((savedUpgrade, i) => {
                    if (clickUpgrades[i]) {
                        clickUpgrades[i].count = savedUpgrade.count || 0;
                        clickUpgrades[i].imageIndex = savedUpgrade.imageIndex || i;
                    }
                });
            }
            
            if (saveData.secondUpgrades) {
                saveData.secondUpgrades.forEach((savedUpgrade, i) => {
                    if (secondUpgrades[i]) {
                        secondUpgrades[i].count = savedUpgrade.count || 0;
                        secondUpgrades[i].imageIndex = savedUpgrade.imageIndex || i;
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

window.addEventListener('load', () => {
    preventImageSaving();
    setupMultitouch();
    loadGame();
    initSounds();
    initSoundButton();
    updateSoundButton();
});

setInterval(saveGame, 30000);

setInterval(() => {
    if (yaGames && Math.random() < 0.5) {
        yaGames.adv.showFullscreenAdv();
    }
}, 300000);