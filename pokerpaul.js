// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        this.lines = [
            "-I've seen you around here a lot lately. <br>I'm guessing you're a new regular.",
            "-The name's Paul. My friends call me Poker Paul.",
            "-...So don't call me that.",
            "-I've been running this table for the past decade.<br>Ever since they built this place.",
            "-I actually used to live here before the Casino.",
            "-It was a nice neighborhood, lots of families.",
            "-About a week before everything happened,<br>The Boss knocked on my door and offered me a room here.",
            "-I said yes, of course.<br>Who could say no to all of this?",
            "-He said I'd just have to keep an eye out<br>for anyone who was trying to...<br>y'know... take him out.",
            "-But nothing has happened in over a decade<br>so I'm not worried anymore.",
            "-Have you ever tried Poker?",
            "-You should join me at the Poker table sometime!",
            "-I've gotta get back to the table.<br>But I'll see you around!"
        ];

        document.getElementById('pokerpaul1lines').innerHTML = this.getLine();
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
            document.getElementById('pokerpaul1lines').innerHTML = this.getLine();
        } else {
            location.href='mainMenu.html';
            console.log("Dialog end.");
        }
    }
}

const conversation = new Dialog();