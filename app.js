// Конфигурация
const CONFIG = {
    BOT_USERNAME: 'HeistCasinoBot' // ЗАМЕНИ НА РЕАЛЬНЫЙ USERNAME ТВОЕГО БОТА
};

// Глобальные переменные
let tg = null;
let currentUser = null;

// Инициализация приложения
function initTelegramApp() {
    try {
        tg = window.Telegram.WebApp;
        
        console.log('=== TELEGRAM WEB APP DATA ===');
        console.log('WebApp:', tg);
        console.log('Init Data:', tg.initData);
        console.log('User Data:', tg.initDataUnsafe);
        console.log('User Object:', tg.initDataUnsafe.user);
        
        // Инициализируем Telegram Web App
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#0f0f0f');
        tg.setBackgroundColor('#0f0f0f');
        
        // Получаем данные пользователя
        currentUser = tg.initDataUnsafe.user;
        
        if (currentUser) {
            console.log('✅ User data loaded successfully:', currentUser);
            updateUserProfile(currentUser);
        } else {
            console.error('❌ No user data found in Telegram WebApp');
            showError('Данные пользователя не найдены');
        }
        
    } catch (error) {
        console.error('❌ Error initializing Telegram app:', error);
        showError('Ошибка загрузки приложения');
    }
}

// Обновление профиля пользователя
function updateUserProfile(user) {
    try {
        console.log('🔄 Updating user profile with:', user);
        
        // Устанавливаем аватарку
        const avatarElement = document.getElementById('userAvatar');
        if (user.photo_url) {
            // Используем реальную аватарку из Telegram
            avatarElement.style.backgroundImage = `url('${user.photo_url}')`;
            avatarElement.textContent = ''; // Убираем букву
            console.log('✅ Avatar loaded from photo_url');
        } else if (user.first_name) {
            // Если нет аватарки, показываем первую букву имени
            avatarElement.textContent = user.first_name.charAt(0).toUpperCase();
            avatarElement.style.backgroundImage = 'none';
            console.log('✅ Using letter avatar');
        } else {
            avatarElement.textContent = 'U';
            avatarElement.style.backgroundImage = 'none';
        }
        
        // Устанавливаем имя пользователя
        const userNameElement = document.getElementById('userName');
        if (user.username) {
            userNameElement.textContent = '@' + user.username;
        } else if (user.first_name) {
            let fullName = user.first_name;
            if (user.last_name) {
                fullName += ' ' + user.last_name;
            }
            userNameElement.textContent = fullName;
        } else {
            userNameElement.textContent = 'Пользователь';
        }
        
        // Устанавливаем ID
        const userIdElement = document.getElementById('userId');
        if (user.id) {
            userIdElement.textContent = 'ID: ' + user.id;
        } else {
            userIdElement.textContent = 'ID: неизвестен';
        }
        
        console.log('✅ Profile updated successfully');
        
    } catch (error) {
        console.error('❌ Error updating user profile:', error);
        showError('Ошибка обновления профиля');
    }
}

// Открытие бота для пополнения
function openBotForDeposit() {
    if (!CONFIG.BOT_USERNAME || CONFIG.BOT_USERNAME.includes('HeistCasinoBot')) {
        showError('Username бота не настроен. Замени HeistCasinoBot в app.js');
        return;
    }
    
    const botUrl = `https://t.me/${CONFIG.BOT_USERNAME}?start=deposit`;
    console.log('🔗 Opening bot for deposit:', botUrl);
    
    // Открываем бота в новом окне
    window.open(botUrl, '_blank');
}

// Открытие бота для вывода
function openBotForWithdraw() {
    if (!CONFIG.BOT_USERNAME || CONFIG.BOT_USERNAME.includes('HeistCasinoBot')) {
        showError('Username бота не настроен. Замени HeistCasinoBot в app.js');
        return;
    }
    
    const botUrl = `https://t.me/${CONFIG.BOT_USERNAME}?start=withdraw`;
    console.log('🔗 Opening bot for withdraw:', botUrl);
    
    // Открываем бота в новом окне
    window.open(botUrl, '_blank');
}

// Показать ошибку
function showError(message) {
    // Можно добавить уведомление или изменить интерфейс
    console.error('💥 Error:', message);
    
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = 'Ошибка загрузки';
    userNameElement.style.color = '#EF4444';
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing Telegram app...');
});

// Инициализация при загрузке
window.addEventListener('load', function() {
    console.log('🎯 Window loaded, starting initialization...');
    initTelegramApp();
});

// Функция для отладки (можно вызвать из консоли)
function debugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('Current User:', currentUser);
    console.log('Telegram WebApp:', tg);
    console.log('Bot Username:', CONFIG.BOT_USERNAME);
    console.log('==================');
}