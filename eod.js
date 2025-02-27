// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        if (!localStorage.getItem('days') || isNaN(Number(localStorage.getItem('days')))) {
            localStorage.setItem('days', '30');
        }
        this.currentDays = Number(localStorage.getItem('days'));
        this.currentSus = Number(localStorage.getItem('suspicion'));
        
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
        }
    }
}

const conversation = new Dialog();