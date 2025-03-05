// Resetting the day
class Reset {
    constructor() {}

    continue() {
        if (localStorage) {
            localStorage.setItem('totalEarnings', String(0));
            localStorage.setItem('dailyEarnings', String(0));
            localStorage.setItem('suspicion', String(0));
            localStorage.setItem('days', String(30));
            localStorage.setItem('favor', String(1.0));
            localStorage.setItem('strangerInteraction1', 'false');
            location.href='mainMenu.html';
        }
    }
}

const gameReset = new Reset();