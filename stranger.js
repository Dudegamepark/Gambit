// Progressing the dialog
class Dialog {
    constructor() {
        this.line = 0;
        
        const line0 = "-Hey you! Stop right there!";
        const line1 = "-Let’s go for a walk. Alone. Outside.";
        const line2 = "-I’ll keep this short. I know what they did to your people.";
        const line3 = "-Look. I know you have no reason to trust me, but I want to help you.";
        const line4 = "-Take this.";
        const line5 = "-If you can cause a distraction from the outside, I’ll work from the inside.";
        const line6 = "-I’ll be watching your progress but I can’t protect you from everyone. Keep the suspicion against you low.";
        const line7 = "-We’ll talk soon. I wish you luck.";

        this.resetDialog();

        document.getElementById('stranger1lines').innerHTML = this.getLine();
    }

    resetDialog() {
        this.line = 0;
    }

    getLine() {
        // i know there's a better way to do this. h
        // owever it is 2 am and i can't remember how lol
        switch (line) {
        case 0:
            return line0;
        case 1:
            return line1;
        case 2:
            return line2;
        case 3:
            return line3;
        case 4:
            return line4;
        case 5:
            return line5;
        case 6:
            return line6;
        case 7:
            return line7;
        default:
            console.log("Invalid input!\n");
        }
    }

    continue() {
        this.line += 1;
        console.log(this.getLine());
        document.getElementById('stranger1lines').innerHTML = this.getLine();
    }
}

// TODO: something is wrong here
const conversation = new Dialog();