// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        if (!localStorage.getItem('days') || isNaN(Number(localStorage.getItem('days')))) {
            localStorage.setItem('days', '30');
        }
        this.currentDays = Number(localStorage.getItem('days'));
        
        this.lines = [
            "<img width='700px' height='380px' src='Assets/Transitions/eodAlarm1159.png' title='The time is 11:59 pm'></img>",
            "<img width='700px' height='380px' src='Assets/Transitions/eodAlarm1200.gif' title='The time is 12:00 am'></img>",
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
        } else {
            this.currentDays -= 1;
            this.updateLocalStorage();
            location.href='mainMenu.html';
            console.log("Dialog end.");
        }
    }

    updateLocalStorage() {
        if (localStorage) {
            localStorage.setItem('days', String(this.currentDays));
        }
    }
}

const conversation = new Dialog();