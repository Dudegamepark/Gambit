// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        this.currentDays = Number(localStorage.getItem('days'));

        if (this.currentDays == 28) {
            this.lines = [
                "-Great! That's what I was hoping you'd say!",
                "-I'll give you a secret. This is how I win Blackjack.",
                "<img height='200px' src='Assets/Cards/Items/jackBlack.png' title='3 Golden Globe nominations. When you go over 21, use this card to reduce your card total by 3. Limit of 3 uses per day.'></img>",
                "-Use it carefully and you could become a<br>WORLD CHAMPION!!!",
                "-Just like me!",
                "-But obviously not as good-looking as I am.",
                "-Sorry to leave so suddenly,<br>but the trash just got dropped off!",
                "-It was quesadilla night in the Poker Room<br>so Mr. Cheese and I will be eating good!",
                "-I'll find you soon. Use that Blackjack card...<br>...but not too much!"
            ];
            console.log("dialog 1");
        } else {
            console.log(this.currentDays);
        }

        document.getElementById('ratman2yeslines').innerHTML = this.getLine();
    }

    getLine() {
        if (this.line < this.lines.length) {
            return this.lines[this.line];
        } else {
            console.log("End of dialog!");
            
            // TODO: update money to current money plus stored val from day 1
            // localStorage.setItem('totalEarnings', String(this.dailyEarnings + this.holdVar));
            // this.updateLocalStorage();
            return ""; // Return an empty message when there's nothing i dunno lololololol
        }
    }

    continue() {
        this.line += 1;
        if (this.line < this.lines.length) {
            document.getElementById('ratman2yeslines').innerHTML = this.getLine();
        } else {
            location.href='mainMenu.html';
            console.log("Dialog end.");
        }
    }
}

const conversation = new Dialog();