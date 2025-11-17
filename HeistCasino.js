let tg = null;
let userData = null;

document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
});

function initTelegramApp() {
    tg = window.Telegram.WebApp;
    
    tg.expand();
    
    const tgUser = tg.initDataUnsafe.user;
    
    if (tgUser) {
        initUser(tgUser);
    } else {
        initDemoUser();
    }
}

function initUser(tgUser) {
    userData = {
        id: tgUser.id,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || '',
        username: tgUser.username || tgUser.first_name,
        photoUrl: tgUser.photo_url,
        balance: 0.00 
    };
    
    updateUserInterface();
    loadUserBalance();
}

function initDemoUser() {
    userData = {
        id: '123456789',
        firstName: 'Демо',
        lastName: 'Пользователь',
        username: 'demo_user',
        photoUrl: null,
        balance: 100.50
    };
    
    updateUserInterface();
}

function updateUserInterface() {
    const avatar = document.getElementById('userAvatar');
    if (userData.photoUrl) {
        avatar.style.backgroundImage = `url(${userData.photoUrl})`;
        avatar.style.backgroundSize = 'cover';
        avatar.textContent = '';
    } else {
        avatar.textContent = userData.firstName.charAt(0).toUpperCase();
    }
    
    document.getElementById('userName').textContent = userData.username;
    
    document.getElementById('userId').textContent = `ID: ${userData.id}`;
    
    document.getElementById('userBalance').textContent = `${userData.balance.toFixed(2)}$`;
}

async function loadUserBalance() {
    try {
        
        userData.balance = 156.75;
        updateUserInterface();
        
    } catch (error) {
        console.error('Ошибка загрузки баланса:', error);
    }
}

function deposit() {
    tg.showPopup({
        title: '💳 Пополнение баланса',
        message: 'Выберите способ пополнения:',
        buttons: [
            {id: 'stars', type: 'default', text: '⭐️ Telegram Stars'},
            {id: 'crypto', type: 'default', text: '💰 CryptoBot'},
            {type: 'cancel'}
        ]
    }, function(buttonId) {
        if (buttonId === 'stars') {
            tg.showAlert('Функция пополнения через Stars будет доступна скоро!');
        } else if (buttonId === 'crypto') {
            tg.showAlert('Функция пополнения через CryptoBot будет доступна скоро!');
        }
    });
}

function initTelegramApp() {
    tg = window.Telegram.WebApp;
    tg.expand();
    
    const tgUser = tg.initDataUnsafe.user;
    
    if (tgUser) {
        initUser(tgUser);
    } else {
        initDemoUser();
    }
    
    tg.showAlert('🎉 Добро пожаловать в HeistCasino!');
}

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Проверяем, запущено ли в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        initTelegramApp();
    } else {
        // Запуск в браузере - демо-режим
        initBrowserDemo();
    }
}

function initTelegramApp() {
    tg = window.Telegram.WebApp;
    tg.expand();
    
    const tgUser = tg.initDataUnsafe.user;
    
    if (tgUser) {
        initUser(tgUser);
        tg.showAlert('🎉 Добро пожаловать в HeistCasino!');
    } else {
        initDemoUser();
    }
}

function initBrowserDemo() {
    console.log('🚀 Запуск в браузере - демо-режим');
    
    // Создаем заглушку для tg функций
    tg = {
        showPopup: function(options, callback) {
            const buttonId = confirm(options.message + "\n\nНажмите OK для продолжения");
            if (callback) callback(buttonId ? 'continue' : 'cancel');
        },
        showAlert: function(message) {
            alert(message);
        },
        expand: function() {
            console.log('App expanded');
        }
    };
    
    initDemoUser();
    alert('🎉 Добро пожаловать в HeistCasino (демо-режим)!');
}

function initUser(tgUser) {
    userData = {
        id: tgUser.id,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || '',
        username: tgUser.username || tgUser.first_name,
        photoUrl: tgUser.photo_url,
        balance: 156.75
    };
    updateUserInterface();
}

function initDemoUser() {
    userData = {
        id: '123456789',
        firstName: 'Демо',
        lastName: 'Пользователь', 
        username: 'demo_user',
        photoUrl: null,
        balance: 100.50
    };
    updateUserInterface();
}

function updateUserInterface() {
    const avatar = document.getElementById('userAvatar');
    if (userData.photoUrl) {
        avatar.style.backgroundImage = `url(${userData.photoUrl})`;
        avatar.style.backgroundSize = 'cover';
        avatar.textContent = '';
    } else {
        avatar.textContent = userData.firstName.charAt(0).toUpperCase();
    }
    
    document.getElementById('userName').textContent = userData.username;
    document.getElementById('userId').textContent = `ID: ${userData.id}`;
    document.getElementById('userBalance').textContent = `${userData.balance.toFixed(2)}$`;
}

function deposit() {
    tg.showPopup({
        title: '💳 Пополнение баланса',
        message: 'Выберите способ пополнения:',
        buttons: [
            {id: 'stars', type: 'default', text: '⭐️ Telegram Stars'},
            {id: 'crypto', type: 'default', text: '💰 CryptoBot'},
            {type: 'cancel'}
        ]
    }, function(buttonId) {
        if (buttonId === 'stars') {
            tg.showAlert('Функция пополнения через Stars будет доступна скоро!');
        } else if (buttonId === 'crypto') {
            tg.showAlert('Функция пополнения через CryptoBot будет доступна скоро!');
        }
    });
}

function withdraw() {
    tg.showPopup({
        title: '💎 Вывод средств', 
        message: 'Для вывода средств необходимо:\n\n• Минимум 1$\n• Сделать хотя бы одну ставку\n• Иметь историю пополнений',
        buttons: [
            {id: 'continue', type: 'default', text: 'Понятно'},
            {type: 'cancel'}
        ]
    });
}
