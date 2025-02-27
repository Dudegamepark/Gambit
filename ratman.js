// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        this.currentDays = Number(localStorage.getItem('days'));

        if (this.currentDays == 29) {
            this.lines = [
                "-Done with your first day, eh? <br>How much did ya win?",
                "-Hey, look man. No need to run away! <br>I'm not trying to rob you!",
                "-I have a proposition. A business proposition!",
                "-You give me all the money you've earned today...",
                "-...and I'll give you everything you've ever wanted tomorrow!",
                "-Sounds fake? Psssh.",
                "-I'm a Blackjack world champion!",
                "-I just need a few bucks to clean myself up, <br>then I'll get into the Casino <br>and double your money in no time!",
                "-Look, look. I've already grabbed your wallet.<br>I'll even give you this in return for now!",
                "<img height='200px' src='Assets/Cards/Items/CheeseHatCard.png' title='Smells so bad, Casino staff dont want to look at you. -10% suspicion when active'></img>",
                "-I've got to go. Mr. Cheese is getting hungry <br>and you do NOT want to meet him past dinner time.",
                "-Meet me here tomorrow.",
                "-You'll see me tomorrow and I will definitely have your money!"
            ];
            console.log("dialog 1");
        } else if (this.currentDays == 28) {
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
                // "<div  style='display: flex; flex-direction: row; align-items: center; justify-content: center;'>   <button class='eod-button'' title='Click here to continue working with Rat Man.'>Continue working with Rat Man</button><button class='eod-button'' title='Click here to stop working with Rat Man.'>Stop working with Rat Man</button></div>"
            ];
            console.log("dialog 2");
        } else {
            console.log(this.currentDays);
        }

        document.getElementById('ratman1lines').innerHTML = this.getLine();
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
            document.getElementById('ratman1lines').innerHTML = this.getLine();
        } else {
            location.href='mainMenu.html';
            console.log("Dialog end.");
        }
    }
}

const conversation = new Dialog();