// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        this.lines = [
            "-Hey you! Stop right there!",
            "-Let’s go for a walk. Alone. Outside.",
            "-I’ll keep this short. I know what they did to your people.",
            "-Look. I know you have no reason to trust me, but I want to help you.",
            "-Take this.",
            "-If you can cause a distraction from the outside, I’ll work from the inside.",
            "-I’ll be watching your progress but I can’t protect you from everyone. Keep the suspicion against you low.",
            "-We’ll talk soon. I wish you luck."
        ];

        document.getElementById('stranger1lines').innerHTML = this.getLine();
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
            document.getElementById('stranger1lines').innerHTML = this.getLine();
        } else {
            location.href='mainmenu.html';
            console.log("Dialog end.");
        }
    }
}

const conversation = new Dialog();