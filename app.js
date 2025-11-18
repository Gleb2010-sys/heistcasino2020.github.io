// Конфигурация
const CONFIG = {
    API_URL: 'https://your-domain.timeweb.cloud/api',
    BOT_USERNAME: 'your_bot_username'
};

// Глобальные переменные
let tg = null;
let currentUser = null;
let currentPaymentId = null;

// Инициализация приложения
function initTelegramApp() {
    try {
        tg = window.Telegram.WebApp;
        
        console.log('Telegram WebApp initialized:', tg);
        console.log('User data:', tg.initDataUnsafe.user);
        
        // Инициализируем Telegram Web App
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#0f0f0f');
        tg.setBackgroundColor('#0f0f0f');
        
        // Получаем данные пользователя
        currentUser = tg.initDataUnsafe.user;
        
        if (currentUser) {
            console.log('User found:', currentUser);
            updateUserInfo(currentUser);
            // Не вызываем initializeApp пока не настроен бэкенд
            // initializeApp(tg.initData);
        } else {
            console.error('No user data found');
            // Показываем тестовые данные для отладки
            showTestData();
        }
        
    } catch (error) {
        console.error('Error initializing Telegram app:', error);
        // Показываем тестовые данные при ошибке
        showTestData();
    }
}

// Обновление информации о пользователе
function updateUserInfo(user) {
    try {
        console.log('Updating user info:', user);
        
        // Устанавливаем аватар
        const avatarElement = document.getElementById('userAvatar');
        if (user.first_name) {
            avatarElement.textContent = user.first_name.charAt(0).toUpperCase();
        } else if (user.username) {
            avatarElement.textContent = user.username.charAt(0).toUpperCase();
        } else {
            avatarElement.textContent = 'U';
        }
        
        // Устанавливаем имя пользователя
        const userNameElement = document.getElementById('userName');
        if (user.username) {
            userNameElement.textContent = '@' + user.username;
        } else if (user.first_name) {
            userNameElement.textContent = user.first_name;
            if (user.last_name) {
                userNameElement.textContent += ' ' + user.last_name;
            }
        } else {
            userNameElement.textContent = 'Пользователь';
        }
        
        // Устанавливаем ID
        const userIdElement = document.getElementById('userId');
        if (user.id) {
            userIdElement.textContent = 'ID: ' + user.id;
        } else {
            userIdElement.textContent = 'ID: loading...';
        }
        
    } catch (error) {
        console.error('Error updating user info:', error);
        showTestData();
    }
}

// Показать тестовые данные для отладки
function showTestData() {
    console.log('Showing test data');
    
    const avatarElement = document.getElementById('userAvatar');
    const userNameElement = document.getElementById('userName');
    const userIdElement = document.getElementById('userId');
    
    avatarElement.textContent = 'T';
    userNameElement.textContent = 'Test User';
    userIdElement.textContent = 'ID: 123456789';
    
    showNotification('Используются тестовые данные', 'warning');
}

// Инициализация приложения с сервером (закомментировано пока нет бэкенда)
async function initializeApp(initData) {
    try {
        console.log('Initializing with server...');
        
        const response = await fetch(`${CONFIG.API_URL}/init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                initData: initData
            })
        });
        
        const data = await response.json();
        console.log('Server response:', data);
        
        if (data.success) {
            currentUser = data.user;
            updateBalance(data.user.balance);
        } else {
            console.error('Server error:', data.error);
            showNotification('Ошибка загрузки данных: ' + data.error, 'error');
        }
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Обновление баланса
function updateBalance(balance) {
    const balanceElement = document.getElementById('userBalance');
    balanceElement.textContent = balance.toFixed(2) + '$';
}

// Открытие модального окна пополнения
function openDepositModal() {
    const modal = document.getElementById('depositModal');
    modal.style.display = 'block';
    document.getElementById('depositAmount').value = '';
}

// Закрытие модального окна
function closeDepositModal() {
    const modal = document.getElementById('depositModal');
    modal.style.display = 'none';
}

// Создание платежа
async function createPayment(method) {
    try {
        const amountInput = document.getElementById('depositAmount');
        const amount = parseFloat(amountInput.value);
        
        if (!amount || amount < 1 || amount > 1000) {
            showNotification('Введите сумму от 1$ до 1000$', 'error');
            return;
        }
        
        if (!currentUser || !currentUser.id) {
            showNotification('Ошибка: данные пользователя не загружены', 'error');
            return;
        }
        
        showNotification('Создание платежа...', 'info');
        
        // Если бэкенд не настроен, показываем демо
        if (!CONFIG.API_URL || CONFIG.API_URL.includes('your-domain')) {
            showNotification('Бэкенд не настроен. Демо-режим', 'warning');
            closeDepositModal();
            openBotDialog(amount, method);
            return;
        }
        
        const response = await fetch(`${CONFIG.API_URL}/create-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                amount: amount,
                payment_method: method
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentPaymentId = data.payment_id;
            closeDepositModal();
            openBotDialog(amount, method);
            startPaymentTracking();
        } else {
            showNotification('Ошибка создания платежа: ' + data.error, 'error');
        }
        
    } catch (error) {
        console.error('Error creating payment:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Открытие диалога с ботом
function openBotDialog(amount, method) {
    if (!CONFIG.BOT_USERNAME || CONFIG.BOT_USERNAME.includes('your_bot_username')) {
        showNotification('Username бота не настроен', 'error');
        return;
    }
    
    const botUrl = `https://t.me/${CONFIG.BOT_USERNAME}?start=payment_${currentPaymentId || 'demo'}`;
    showNotification(`Откройте бота для оплаты ${amount}$`, 'info', 4000);
    
    setTimeout(() => {
        window.open(botUrl, '_blank');
    }, 1500);
}

// Отслеживание статуса платежа
async function startPaymentTracking() {
    if (!currentPaymentId) return;
    
    const checkInterval = setInterval(async () => {
        try {
            const response = await fetch(`${CONFIG.API_URL}/payment-status/${currentPaymentId}`);
            const data = await response.json();
            
            if (data.success) {
                if (data.status === 'completed') {
                    showNotification(`✅ Пополнено ${data.amount}$!`, 'success', 5000);
                    updateBalance(data.amount + (currentUser.balance || 0));
                    clearInterval(checkInterval);
                } else if (data.status === 'failed') {
                    showNotification('❌ Платеж не прошел', 'error', 5000);
                    clearInterval(checkInterval);
                }
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    }, 3000);
    
    setTimeout(() => clearInterval(checkInterval), 300000);
}

// Функция вывода средств
function withdraw() {
    if (!CONFIG.BOT_USERNAME || CONFIG.BOT_USERNAME.includes('your_bot_username')) {
        showNotification('Username бота не настроен', 'error');
        return;
    }
    
    showNotification('Для вывода откройте диалог с ботом', 'info');
    const botUrl = `https://t.me/${CONFIG.BOT_USERNAME}?start=withdraw`;
    
    setTimeout(() => {
        window.open(botUrl, '_blank');
    }, 1000);
}

// Показать уведомление
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#8B5CF6',
        warning: '#F59E0B'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('depositModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDepositModal();
        }
    });
    
    document.getElementById('depositAmount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            createPayment('crypto');
        }
    });
});

// Инициализация при загрузке
window.addEventListener('load', initTelegramApp);

// Добавляем функцию для ручной проверки данных
function debugUserData() {
    console.log('Current user:', currentUser);
    console.log('Telegram WebApp:', tg);
    showNotification('Данные выведены в консоль', 'info');
}