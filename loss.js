// Resetting the day
class Reset {
    constructor() {}

    continue() {
        if (localStorage) {
            let abTest = -1;
            if (localStorage.getItem("blackjack")) {
                let abTest = JSON.parse(localStorage.getItem("blackjack")).abTutorialTester;
            }
            localStorage.clear();

            // retain abTest identity
            if (abTest !== -1) {
                localStorage.setItem("blackjack", JSON.stringify({
                    "multiplier": 0.0,
                    "strangerInteraction1": false,
                    "abTutorialTester": abTest,
                    "onboarded": false
                }));
            }

            location.href='mainMenu.html';
        }
    }
}

const gameReset = new Reset();