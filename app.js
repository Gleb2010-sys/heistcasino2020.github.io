const CONFIG = {
    BOT_USERNAME: 'HeistCasinoBot'
};

function initTelegramApp() {
    try {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        const user = tg.initDataUnsafe.user;
        if (user) {
            // Показываем первую букву имени для аватарки
            document.getElementById('userAvatar').textContent = user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U';
            
            // Показываем полное имя из аккаунта Telegram
            let displayName = user.first_name || 'Пользователь';
            if (user.last_name) {
                displayName += ' ' + user.last_name;
            }
            document.getElementById('userName').textContent = displayName;
        }
    } catch (error) {
        document.getElementById('userName').textContent = 'Ошибка загрузки';
    }
}

function openBotForDeposit() {
    window.open(`https://t.me/${CONFIG.BOT_USERNAME}?start=deposit`, '_blank');
}

function openBotForWithdraw() {
    window.open(`https://t.me/${CONFIG.BOT_USERNAME}?start=withdraw`, '_blank');
}

window.onload = initTelegramApp;
