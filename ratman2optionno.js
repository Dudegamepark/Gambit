// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        this.currentDays = Number(localStorage.getItem('days'));

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
            return ""; // Return an empty message when there's nothing i dunno lololololol
        }
    }

    continue() {
        this.line += 1;
        if (this.line < this.lines.length) {
            document.getElementById('ratman2nolines').innerHTML = this.getLine();
        } else {
            location.href='mainMenu.html';
            console.log("Dialog end.");
        }
    }
}

const conversation = new Dialog();