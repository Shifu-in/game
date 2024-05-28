document.addEventListener("DOMContentLoaded", function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainScreen = document.getElementById('main-screen');
    const partnersScreen = document.getElementById('partners-screen');
    const tapArea = document.getElementById('tap-area');
    const stats = document.getElementById('stats');
    const partnersBtn = document.getElementById('partners-btn');
    const backBtn = document.getElementById('back-btn');
    const copyReferralBtn = document.getElementById('copy-referral-btn');

    let coins = 0;

    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainScreen.style.display = 'block';
    }, 3000);

    tapArea.addEventListener('click', () => {
        coins += 1; // Placeholder logic for tap mining
        stats.innerText = `Coins: ${coins}`;
    });

    partnersBtn.addEventListener('click', () => {
        mainScreen.style.display = 'none';
        partnersScreen.style.display = 'block';
    });

    backBtn.addEventListener('click', () => {
        partnersScreen.style.display = 'none';
        mainScreen.style.display = 'block';
    });

    copyReferralBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('Your referral link').then(() => {
            alert('Referral link copied to clipboard!');
        });
    });

    document.querySelectorAll('.subscribe-btn').forEach(button => {
        button.addEventListener('click', () => {
            coins += 5; // Placeholder logic for subscription reward
            stats.innerText = `Coins: ${coins}`;
        });
    });
});
