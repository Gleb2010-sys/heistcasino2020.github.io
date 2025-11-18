// Конфигурация
const CONFIG = {
    API_URL: 'https://your-domain.timeweb.cloud/api', // Замените на ваш домен
    BOT_USERNAME: 'your_bot_username' // Замените на username вашего бота
};

// Глобальные переменные
let tg = null;
let currentUser = null;
let currentPaymentId = null;

// Инициализация приложения
function initTelegramApp() {
    try {
        tg = window.Telegram.WebApp;
        
        // Инициализируем Telegram Web App
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#0f0f0f');
        tg.setBackgroundColor('#0f0f0f');
        
        // Получаем данные пользователя
        const initData = tg.initData;
        currentUser = tg.initDataUnsafe.user;
        
        if (currentUser) {
            updateUserInfo(currentUser);
            initializeApp(initData);
        } else {
            showNotification('Ошибка загрузки данных пользователя', 'error');
        }
        
    } catch (error) {
        console.error('Error initializing Telegram app:', error);
        showNotification('Ошибка инициализации приложения', 'error');
    }
}

// Обновление информации о пользователе
function updateUserInfo(user) {
    try {
        // Устанавливаем аватар
        const avatarElement = document.getElementById('userAvatar');
        if (user.first_name) {
            avatarElement.textContent = user.first_name.charAt(0).toUpperCase();
        }
        
        // Устанавливаем имя пользователя
        const userNameElement = document.getElementById('userName');
        if (user.username) {
            userNameElement.textContent = '@' + user.username;
        } else if (user.first_name) {
            userNameElement.textContent = user.first_name;
        }
        
        // Устанавливаем ID
        const userIdElement = document.getElementById('userId');
        userIdElement.textContent = 'ID: ' + user.id;
        
    } catch (error) {
        console.error('Error updating user info:', error);
    }
}

// Инициализация приложения с сервером
async function initializeApp(initData) {
    try {
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
        
        if (data.success) {
            currentUser = data.user;
            updateBalance(data.user.balance);
        } else {
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
        
        // Валидация суммы
        if (!amount || amount < 1 || amount > 1000) {
            showNotification('Введите сумму от 1$ до 1000$', 'error');
            return;
        }
        
        showNotification('Создание платежа...', 'info');
        
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
    const botUrl = `https://t.me/${CONFIG.BOT_USERNAME}?start=payment_${currentPaymentId}`;
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
    
    // Цвета уведомлений
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
    // Закрытие модального окна при клике вне его
    document.getElementById('depositModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDepositModal();
        }
    });
    
    // Enter в поле ввода суммы
    document.getElementById('depositAmount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            createPayment('crypto');
        }
    });
    
    // Кнопка "Продать все"
    document.querySelector('.sell-all-btn').addEventListener('click', function() {
        showNotification('Инвентарь пуст', 'info');
    });
});

// Инициализация при загрузке
window.addEventListener('load', initTelegramApp);