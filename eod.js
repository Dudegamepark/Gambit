// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        if (!localStorage.getItem('days') || isNaN(Number(localStorage.getItem('days')))) {
            localStorage.setItem('days', '30');
        }

        this.currentDays = Number(localStorage.getItem('days'));
        this.currentSus = Number(localStorage.getItem('suspicion'));
        this.dailyEarnings = Number(localStorage.getItem('dailyEarnings'));
        this.totalEarnings = Number(localStorage.getItem('totalEarnings'));
        
        // Favor will adapt and scale earnings on subsequent day
        // If we don't already have a value for it, we default to 1.0x
        if (!localStorage.getItem('favor')) {
            this.favor = 1.0;
        } else {
            this.favor = Number(localStorage.getItem('favor'));
        }

        // Step 1: Scale the earnings for today
        //  We compute our Favored Bonus for today to add to our total/daily earnings
        const favoredBonus = this.dailyEarnings * this.favor - this.dailyEarnings;
        this.totalEarnings += Number(favoredBonus);
        this.dailyEarnings += Number(favoredBonus);
        
        const expectedEarningsCurr = 160 * Math.pow((30 - this.currentDays), 2);

        if (expectedEarningsCurr > this.dailyEarnings * 0.9) {
            // Step 2: Compute favor for the subsequent day
            //  We use our loose internal earnings model to find expected earnings
            //  Then we compare it with our actual dailyEarnings value
            //  We set favor based on how much extra we expect must be earned on the next day
            const expectedEarningsNext = 160 * Math.pow((30 - this.currentDays + 1), 2);
            const dailyDiff = expectedEarningsCurr - this.dailyEarnings;

            // [excess expected earnings] / [original expected earnings] * 0.85 (scalar)
            this.favor = 1.0 + ((expectedEarningsNext + dailyDiff) / expectedEarningsNext) * 0.85;
        } else {
            this.favor = 1.0;
        }

        console.log(`Fortune favors the bold. Your current Favor is x${this.favor.toFixed(2)}.`)
        
        this.lines = [
            "<img height='300px' src='Assets/Transitions/eodAlarm1159.png' title='The time is 11:59 pm'></img>",
            "<img height='300px' src='Assets/Transitions/eodAlarm1200.gif' title='The time is 12:00 am'></img>",
        ];

        document.getElementById('alarm').innerHTML = this.getLine();
    }

    getLine() {
        if (this.line < this.lines.length) {
            return this.lines[this.line];
        } else {
            console.log("End of dialog!");
            return ""; // Return an empty message when there's nothing
        }
    }

    continue() {
        this.line += 1;
        if (this.line < this.lines.length) {
            document.getElementById('alarm').innerHTML = this.getLine();
        } else if (this.currentDays == 30) {
            this.currentDays -= 1;
            this.currentSus = 0;
            // update money to 0 because ratman stole your wallet
            // store double that money amount in a local var
            // to return on day 2
            this.updateLocalStorage();
            location.href='ratman.html';
            console.log("Dialog end.");
        // } else if (this.currentDays == 29) {
        //     this.currentDays -= 1;
        //     this.currentSus = 0;
        //     // update money to current money plus stored val from day 1
        //     this.updateLocalStorage();
        //     location.href='ratman.html';
        //     console.log("Dialog end.");
        } else if (this.currentDays == 28) {
            this.currentDays -= 1;
            this.currentSus = 0;
            this.updateLocalStorage();
            location.href='pokerpaul.html';
            console.log("Dialog end.");
        } else {
            this.currentDays -= 1;
            this.currentSus = 0;
            this.updateLocalStorage();
            location.href='mainMenu.html';
            console.log("Dialog end.");
        }
    }

    updateLocalStorage() {
        if (localStorage) {
            localStorage.setItem('days', String(this.currentDays));
            localStorage.setItem('suspicion', String(this.currentSus));
            localStorage.setItem('totalEarnings', String(this.totalEarnings));
            localStorage.setItem('dailyEarnings', String(0.0));
            localStorage.setItem('favor', String(this.favor));
        }
    }
}

const conversation = new Dialog();