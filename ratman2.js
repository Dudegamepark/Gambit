// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        this.currentDays = Number(localStorage.getItem('days'));

        if (this.currentDays == 28) {
            this.lines = [
                "-Hey! Hey you! Wait!",
                "-I came back, just like I promised!",
                "-What? Why are you looking at me like that?",
                "-Oh. You thought I was never coming back...",
                "-...well, I did!<br>And I doubled your money!",
                "-No strings attached, all for you.<br>Just like I said.",
                "-Ok actually. There is one string attached...",
                "-I want to keep working with you. We make a good team!",
                "-You fund me, and I'll give you a portion of my earnings.",
                "The Casino will never suspect a thing!",
                "-What do you say?",
            ];
            console.log("dialog 2");
        } else {
            console.log(this.currentDays);
        }

        document.getElementById('ratman2lines').innerHTML = this.getLine();
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
            document.getElementById('ratman2lines').innerHTML = this.getLine();
        } else {
            document.getElementById('id01').style.display='block';
            console.log("Dialog end.");
        }
    }
}

const conversation = new Dialog();