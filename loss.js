// Resetting the day
class Reset {
    constructor() {}

    continue() {
        if (localStorage) {
            localStorage.clear();
            location.href='mainMenu.html';
        }
    }
}

const gameReset = new Reset();