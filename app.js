const CONFIG = {
    BOT_USERNAME: 'HeistCasinoBot'
};

let tg = null;

function initTelegramApp() {
    try {
        tg = window.Telegram.WebApp;
        
        tg.expand();
        tg.enableClosingConfirmation();
        
        const user = tg.initDataUnsafe.user;
        
        if (user) {
            document.getElementById('userAvatar').textContent = user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U';
            document.getElementById('userName').textContent = user.username ? '@' + user.username : user.first_name || 'Пользователь';
            document.getElementById('userId').textContent = 'ID: ' + user.id;
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

window.addEventListener('load', initTelegramApp);