// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        this.lines = [
            "-Done with your first day, eh? <br>How much did ya win?",
            "-Hey, look man. No need to run away! <br>I'm not trying to rob you!",
            "-I have a proposition. A business proposition!",
            "-You give me all the money you've earned today,<br>and I'll give you everything you've ever wanted tomorrow.",
            "-Sounds fake? Psssh.",
            "-I'm a Blackjack world champion! I just need a few bucks to clean myself up <br>and then I'll get into the Casino and double your money in no time!",
            "-Look, look. I've already grabbed your wallet.<br>I'll even give you this in return for now!",
            "<img width='300px' height='400px' src='Assets/Cards/Items/CheeseHatCard.png' title='Smells so bad, Casino staff dont want to look at you. -10% suspicion when active'></img>",
            "-I've got to go. Mr. Cheese is getting hungry <br>and you do NOT want to meet him past dinner time.",
            "-Meet me here tomorrow.",
            "You'll see me tomorrow and I will definitely have your money!"
        ];

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
            location.href='index.html';
            console.log("Dialog end.");
        }
    }
}

const conversation = new Dialog();