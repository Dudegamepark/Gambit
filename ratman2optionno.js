// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        this.currentDays = Number(localStorage.getItem('days'));
        this.dailyEarnings = Number(localStorage.getItem('dailyEarnings'));
        this.totalEarnings = Number(localStorage.getItem('totalEarnings'));
        this.holdVar = Number(localStorage.getItem('holdVar'));

        if (this.currentDays == 28) {
            this.lines = [
                "-Aww man...<br>that's too bad.",
                "-Whelp! I guess you leave me no choice.",
                "-Stop panicking! You've got to learn<br>how to hold onto your wallet better.",
                "-Thanks for the extra dough!",
                "-I'll see you around.<br>Tell the chefs to throw out more nachos!"
            ];
            console.log("dialog 1");
        } else {
            console.log(this.currentDays);
        }

        document.getElementById('ratman2nolines').innerHTML = this.getLine();
    }

    getLine() {
        if (this.line < this.lines.length) {
            return this.lines[this.line];
        } else {
            console.log("End of dialog!");
            return "";
        }
    }

    continue() {
        this.line += 1;
        if (this.line < this.lines.length) {
            document.getElementById('ratman2nolines').innerHTML = this.getLine();
        } else {
            this.totalEarnings = 0;
            this.holdVar = 0;
            this.updateLocalStorage();
            location.href='mainMenu.html';
            console.log("Dialog end.");
        }
    }

    updateLocalStorage() {
        if (localStorage) {
            localStorage.setItem('totalEarnings', String(this.totalEarnings));
        }
    }
}

const conversation = new Dialog();