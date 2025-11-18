const CONFIG = {
    BOT_USERNAME: 'HeistCasinoBot'
};

let tg = null;
let currentUser = null;

function initTelegramApp() {
    try {
        tg = window.Telegram.WebApp;
        
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#0f0f0f');
        tg.setBackgroundColor('#0f0f0f');
        
        currentUser = tg.initDataUnsafe.user;
        
        if (currentUser) {
            updateUserProfile(currentUser);
        } else {
            parseUserFromInitData(tg.initData);
        }
        
    } catch (error) {
        showError('Ошибка загрузки приложения');
    }
}

function parseUserFromInitData(initData) {
    try {
        if (!initData) {
            showError('Нет данных от Telegram');
            return;
        }
        
        const params = new URLSearchParams(initData);
        const userParam = params.get('user');
        
        if (userParam) {
            const userData = JSON.parse(decodeURIComponent(userParam));
            updateUserProfile(userData);
        } else {
            showError('Данные пользователя не найдены');
        }
        
    } catch (error) {
        showError('Ошибка парсинга данных');
    }
}

function updateUserProfile(user) {
    try {
        const avatarElement = document.getElementById('userAvatar');
        if (user.photo_url) {
            avatarElement.style.backgroundImage = `url('${user.photo_url}')`;
            avatarElement.textContent = '';
        } else {
            let firstLetter = 'U';
            if (user.first_name) {
                firstLetter = user.first_name.charAt(0).toUpperCase();
            } else if (user.username) {
                firstLetter = user.username.charAt(0).toUpperCase();
            }
            avatarElement.textContent = firstLetter;
            avatarElement.style.backgroundImage = 'none';
        }
        
        const userNameElement = document.getElementById('userName');
        let displayName = 'Пользователь';
        if (user.username) {
            displayName = '@' + user.username;
        } else if (user.first_name) {
            displayName = user.first_name;
            if (user.last_name) {
                displayName += ' ' + user.last_name;
            }
        }
        userNameElement.textContent = displayName;
        
        const userIdElement = document.getElementById('userId');
        if (user.id) {
            userIdElement.textContent = 'ID: ' + user.id;
        } else {
            userIdElement.textContent = 'ID: неизвестен';
        }
        
    } catch (error) {
        showError('Ошибка обновления профиля');
    }
}

function openBotForDeposit() {
    if (!CONFIG.BOT_USERNAME || CONFIG.BOT_USERNAME.includes('HeistCasinoBot')) {
        showError('Username бота не настроен');
        return;
    }
    
    const botUrl = `https://t.me/${CONFIG.BOT_USERNAME}?start=deposit`;
    window.open(botUrl, '_blank');
}

function openBotForWithdraw() {
    if (!CONFIG.BOT_USERNAME || CONFIG.BOT_USERNAME.includes('HeistCasinoBot')) {
        showError('Username бота не настроен');
        return;
    }
    
    const botUrl = `https://t.me/${CONFIG.BOT_USERNAME}?start=withdraw`;
    window.open(botUrl, '_blank');
}

function showError(message) {
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = message;
    userNameElement.style.color = '#EF4444';
}

document.addEventListener('DOMContentLoaded', function() {
});

window.addEventListener('load', function() {
    initTelegramApp();
});
