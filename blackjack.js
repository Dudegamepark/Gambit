
// Playing card class; suits and ranks
class Card {
  // Note that the constructor is not 
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  // Return: the Blackjack score for this card
  getScore() {
    if (this.rank > 10) {
      return 10;
    } else {
      return this.rank;
    }
  }

  // Return: card suit
  getSuit() {
    return this.suit;
  }

  // Return: card rank as a 1 letter string
  getRank() {
    if (this.rank === 1) {
      return 'A';
    } else if (this.rank === 11) {
      return 'J';
    } else if (this.rank === 12) {
      return 'Q';
    } else if (this.rank === 13) {
      return 'K';
    } else {
      return this.rank.toString();
    }
  }

  toString() {
    return `${this.getRank()} of ${this.getSuit()}`;
  }
}

// Deck class; has all 52 unique cards
class Deck {
  // Static values of all possible card suits and ranks
  // Try not to initialize cards outside of the Deck class
  // Ranks are NOT scores; use Card.getScore() for scoring
  static suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  static ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  constructor() {
    this.resetDeck();
  }

  // Empties the deck and intializes 52 cards again
  // Saves some memory if we reset decks instead of remaking them
  resetDeck() {
    this.cards = [];

    Deck.suits.forEach(suit => {
      Deck.ranks.forEach(rank => {
        this.cards.push(new Card(suit, rank));
      });
    });
  }

  // Draw a random card from the deck (removes the card)
  // Return: drawn card object (no longer in deck)
  // Try not to use this method outside the BlackjackPlayer class
  draw() {
    const drawIndex = Math.floor(Math.random() * this.cards.length);
    const drawnCard = this.cards[drawIndex];
    this.cards.splice(drawIndex, 1);
    
    return drawnCard;
  }
}

// Blackjack game-running class; has 2 decks and 2 hands
class Blackjack {
  constructor() {
    // Used for onboarding tutorial only
    // A: Teach players how to double
    this.tutorialPagesA = [
      "Assets\\Tutorials\\Blackjack\\tutStart.png",
      "Assets\\Tutorials\\Blackjack\\tutHouseHandArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutPlayerHandArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutHitArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutStandArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutYouWon.png",
      "Assets\\Tutorials\\Blackjack\\tutWalletArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutDoubleArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutYouWon.png",
      "Assets\\Tutorials\\Blackjack\\tutYoureReady.png",
      "Assets\\Tutorials\\Blackjack\\tutHelpArrow.png"
    ];
    // B: Let players decide second tutorial hand themselves
    this.tutorialPagesB = [
      "Assets\\Tutorials\\Blackjack\\tutStart.png",
      "Assets\\Tutorials\\Blackjack\\tutHouseHandArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutPlayerHandArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutHitArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutStandArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutYouWon.png",
      "Assets\\Tutorials\\Blackjack\\tutChoice.png",
      "Assets\\Tutorials\\Blackjack\\tutStandArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutYouWon.png",
      "Assets\\Tutorials\\Blackjack\\tutWalletArrow.png",
      "Assets\\Tutorials\\Blackjack\\tutYoureReady.png",
      "Assets\\Tutorials\\Blackjack\\tutHelpArrow.png"
    ];

    this.tutorialPage = 0;

    // Used for Future Sight
    this.peekedCard = new Card('NULL', 0);

    // House entity
    this.house = new BlackjackPlayer();

    // Player entity
    this.player = new BlackjackPlayer();

    // Additional player stats
    this.playerCurrentEarnings = 0.0;

    if (localStorage && localStorage.getItem('totalEarnings')) {
      this.playerTotalEarnings = Number(localStorage.getItem('totalEarnings'));
    } else {
      this.playerTotalEarnings = 0.0;
    }

    if (localStorage && localStorage.getItem('items')) {
      this.items = JSON.parse(localStorage.getItem('items'));
    } else {
      this.items = {};
    }

    if (localStorage && localStorage.getItem('spentMoney')) {
      this.playerSpentMoney = Number(localStorage.getItem('spentMoney'));
    } else {
      this.playerSpentMoney = 0.0;
    }

    if (localStorage && localStorage.getItem('dailyEarnings')) {
      this.playerDailyEarnings = Number(localStorage.getItem('dailyEarnings'));
    } else {
      this.playerDailyEarnings = 0.0;
    }

    if (localStorage && localStorage.getItem('suspicion')) {
      this.suspicion = Number(localStorage.getItem('suspicion'));
    } else {
      this.suspicion = 0.0;
    }

    if (localStorage && localStorage.getItem('blackjack')) {
      const stats = JSON.parse(localStorage.getItem('blackjack'));
      this.playerBaseMult = stats.multiplier;
      this.strangerInteraction1 = stats.strangerInteraction1;
      this.onboarded = stats.onboarded;
      this.abTutorialTester = stats.abTutorialTester;
    } else {
      this.playerBaseMult = 1.0;
      this.strangerInteraction1 = false;
      this.onboarded = false;
      this.abTutorialTester = Math.floor(Math.random() * 2) + 1;
      dataLayer.push({
        event: 'abTutorialTester',
        tutorial_data: this.abTutorialTester
      });
    }

    // Stranger interaction 1 happens after 5 wins
    if (!this.strangerInteraction1) {
      this.fiveWins = 0;
    }

    // Decide whether to go to scripted tutorial or reset normally
    if (!this.onboarded) {
      this.resetTutorial();
    } else {
      this.resetRound();
    }
  }

  // Resets decks and empties hands
  // To be called after every round of 21
  // Also call this to start the game
  resetRound() {
    this.peekedCard = new Card("NULL", 0);

    this.house.reset();
    this.player.reset();

    // Clear the card visuals from hands
    document.getElementById("p-hand").replaceChildren();
    document.getElementById("h-hand").replaceChildren();

    // Draw 2 cards for the house and player
    // Impossible to bust so no check included
    // Only need to compute earnings for player so the
    //  the returned values for house are ignored
    this.house.draw();
    this.house.draw();

    this.earn(this.player.draw());
    this.earn(this.player.draw());

    this.updateLocalState();
    this.displayStats(false);
    document.getElementById('r-result').innerHTML = '';
  }

  // Sets game state to predetermined tutorial numbers
  //   (different results based on A/B group)
  resetTutorial() {
    this.house.reset();
    this.player.reset();

    // Clear the card visuals from hands
    document.getElementById("p-hand").replaceChildren();
    document.getElementById("h-hand").replaceChildren();

    if (this.tutorialPage === 0) {
      this.house.drawSpecific(new Card("Hearts", 1));
      this.house.drawSpecific(new Card("Spades", 3));
  
      this.earn(this.player.drawSpecific(new Card("Spades", 11)));
      this.earn(this.player.drawSpecific(new Card("Clubs", 4)));
    } else {
      if (this.abTutorialTester === 1) {
        this.house.drawSpecific(new Card("Clubs", 8));
        this.house.drawSpecific(new Card("Diamonds", 13));
    
        this.earn(this.player.drawSpecific(new Card("Diamonds", 8)));
        this.earn(this.player.drawSpecific(new Card("Spades", 10)));
      } else {
        this.house.drawSpecific(new Card("Clubs", 6));
        this.house.drawSpecific(new Card("Diamonds", 13));
    
        this.earn(this.player.drawSpecific(new Card("Diamonds", 8)));
        this.earn(this.player.drawSpecific(new Card("Spades", 10)));
      }
    }

    this.updateLocalState();
    this.displayStats(false);
    document.getElementById('r-result').innerHTML = '';

    if (this.tutorialPage === 0) {
      document.getElementById('back-butt').style.display = "none";
      document.getElementById('help-butt').style.pointerEvents = "none";
      document.getElementById('hit-butt').style.pointerEvents = "none";
      document.getElementById('double-butt').style.pointerEvents = "none";
      document.getElementById('stand-butt').style.pointerEvents = "none";

      if (this.abTutorialTester === 1) {
        this.appearTutorial(this.tutorialPagesA[this.tutorialPage]);
      } else {
        document.getElementById('help-butt').style.backgroundColor = "#002810";
        document.getElementById('help-butt').style.borderColor = "#002810";
        document.getElementById('help-butt').style.color = "#002810";
        this.appearTutorial(this.tutorialPagesB[this.tutorialPage]);
      }

      this.tutorialPage += 1;
    }
  }

  // Updates player score and multiplier based on a card
  // Param: card object that was just drawn
  earn(card) {
    if (!this.player.doubling) {
      // 'hit' case

      // tempMult is used once per draw
      // Earn money equal to the card's score * resultant score /10
      // If the resultant score is below 10, tempMult = 1.0x
      // e.g. 12 + 4 => +(4 * 1.6)
      let tempMult = 1.0;
      if (this.player.sum > 10) {
        tempMult = this.player.sum * 1.0 / 10;
      }

      this.playerCurrentEarnings += tempMult * card.getScore();
    } else {
      // 'double' case

      // Earn money equal to the total resultant score * resultant score /10
      // If the resultant score is below 10, tempMult = 1.0x
      // e.g. 12 + 6 => +(18 * 1.8)
      let tempMult = 1.0;
      if (this.player.sum > 10) {
        tempMult = this.player.sum * 1.0 / 10;
      }

      this.playerCurrentEarnings += tempMult * (this.player.sum + card.getScore());
      this.suspicion += 2.0;
    }
  }

  // Completes a round after player is done drawing
  // Param: string representation of which button the player clicked
  houseLoop(roundOver) {
    while (this.house.drawing && !roundOver) {
      // Receives true if house busts
      if (this.houseMove()) {
        roundOver = true;
      }
    }

    this.displayStats(false);
    
    // TODO: Find a place to display the final hands information; maybe at the bottom of sidebar?
    document.getElementById('fbar').innerHTML = `Final Hands: </br> YOU (${this.player.sum}): </br> ${this.player.handToString()} </br> </br> HOUSE (${this.house.sum}): </br>${this.house.handToString()}`;
    
    this.completeRound();

    this.disableButtons();
    
    setTimeout(() => {
      document.getElementById('sbar').innerHTML = `Total Earnings: ${this.playerTotalEarnings - this.playerSpentMoney} (+${this.playerBaseMult * this.playerCurrentEarnings}) - Multiplier: ${this.playerBaseMult}`;
      
      if (!this.onboarded) {
        this.resetTutorial();
      } else {
        this.resetRound();
      }
      this.enableButtons();
    }, 2000);
  }

  disableButtons() {
    document.getElementById('gc-blackjack').style.setProperty('pointer-events', 'none');
  }
  
  enableButtons() {
    document.getElementById('gc-blackjack').style.setProperty('pointer-events', 'auto');
  }

  // Updates earnings/base multiplier based on final state; resets round afterward
  completeRound() {
    if (this.player.checkBust()) {
      // Lose condition 1: player bust
      // baseMult = 1.0; round earnings = 0
      this.playerBaseMult = 1.0;
      dataLayer.push({
        event: 'blackjack_lose'
      });
      document.getElementById('r-result').innerHTML = 'You lose!';
    } else if (this.house.checkBust() || this.player.sum > this.house.sum) {
      // Win conditions: house bust or player sum is higher
      // baseMult increments; round earnings multiplied by base and added to total
      this.playerTotalEarnings += this.playerCurrentEarnings * this.playerBaseMult;
      this.playerDailyEarnings += this.playerCurrentEarnings * this.playerBaseMult;
      // if they have not interacted with the stranger
      if (!this.strangerInteraction1 && this.fiveWins >= 5) {
        // npc box pops up
        document.getElementById('id01').style.display='block';
        this.strangerInteraction1 = true;
      } else {
        this.fiveWins += 1;
      }
      
      switch (this.player.sum) {
        case 21:
          this.playerBaseMult += 0.5;
          break;
        case 20:
          this.playerBaseMult += 0.4;
          break;
        case 19:
          this.playerBaseMult += 0.3;
          break;
        case 18:
          this.playerBaseMult += 0.2;
          break;
        case 17:
          this.playerBaseMult += 0.1;
          break;
        }
        
      // Suspicion increments by money gained
      this.suspicion += this.calcSus(this.playerCurrentEarnings * this.playerBaseMult);
      dataLayer.push({
        event: 'blackjack_win'
      });
      document.getElementById('r-result').innerHTML = 'You win!';

    } else if (this.house.sum > this.player.sum) {
      // Lose condition 2: house sum is higher
      // baseMult = 1.0; round earnings = 0
      this.playerBaseMult = 1.0;
      dataLayer.push({
        event: 'blackjack_lose'
      });
      document.getElementById('r-result').innerHTML = 'You lose!';
    } else if (this.house.sum === this.player.sum) {
      // Tie condition: house and player sums are equal
      // baseMult is retained; add round earnings / 2 to total
      // Suspicion increments by money gained

      this.playerTotalEarnings += (this.playerCurrentEarnings * this.playerBaseMult) / 2;
      this.playerDailyEarnings += (this.playerCurrentEarnings * this.playerBaseMult) / 2;
      this.suspicion += this.calcSus((this.playerCurrentEarnings * this.playerBaseMult) / 2);

      document.getElementById('r-result').innerHTML = 'You tied!';

      // if they have not interacted with the stranger
      if (!this.strangerInteraction1 && this.fiveWins >= 5) {
        // npc box pops up
        document.getElementById('id01').style.display='block';
        this.strangerInteraction1 = true;
      } else {
        this.fiveWins += 1;
      }

    } else {
      // Sanity case
      console.log('Something went horribly wrong in completeRound()...')
    }

    // General reset steps; everything has been incremented
    this.playerCurrentEarnings = 0;
    this.updateLocalState();

    // Check if suspicion is greater than 100
    // if yes, change to game loss screen
    if (this.checkSus()) {
      document.getElementById('id02').style.display='block';
    }
    if (this.checkWin()) {
      document.getElementById('id03').style.display='block';
    }
  }

  // Check if the player has maxxed out suspicion
  checkSus() {
    return this.suspicion > 99;
  }

  // Check if the player has won the game
  checkWin() {
    return this.playerTotalEarnings > 999999;
  }
  
  appearTutorial(imgPath) {
    const tutorial = document.getElementById('tutorial-contain');
    const tutorialImg = document.getElementById('tutorial-pic');

    tutorialImg.src = imgPath;
    tutorial.style.display = "block";
  }

  progressTutorial() {
    if (this.abTutorialTester === 1) {
      this.appearTutorial(this.tutorialPagesA[this.tutorialPage]);

      if (this.tutorialPage === 3) {
        document.getElementById('tut-next-butt').style.display = "none";
        document.getElementById('hit-butt').style.pointerEvents = "all";
      } else if (this.tutorialPage === 4) {
        document.getElementById('hit-butt').style.pointerEvents = "none";
        document.getElementById('stand-butt').style.pointerEvents = "all";
      } else if (this.tutorialPage === 5) {
        document.getElementById('stand-butt').style.pointerEvents = "none";
        document.getElementById('tut-next-butt').style.display = "block";
      } else if (this.tutorialPage === 7) {
        document.getElementById('tut-next-butt').style.display = "none";
        document.getElementById('double-butt').style.pointerEvents = "all";
      } else if (this.tutorialPage === 8) {
        document.getElementById('tut-next-butt').style.display = "block";
        document.getElementById('double-butt').style.pointerEvents = "none";
      } else if (this.tutorialPage >= this.tutorialPagesA.length) {
        document.getElementById('tutorial-contain').style.display = "none";
        document.getElementById('back-butt').style.display = "block";
        document.getElementById('help-butt').style.pointerEvents = "all";
        document.getElementById('hit-butt').style.pointerEvents = "all";
        document.getElementById('double-butt').style.pointerEvents = "all";
        document.getElementById('stand-butt').style.pointerEvents = "all";
        this.onboarded = true;
      }
    } else {
      this.appearTutorial(this.tutorialPagesB[this.tutorialPage]);

      if (this.tutorialPage === 3) {
        document.getElementById('tut-next-butt').style.display = "none";
        document.getElementById('hit-butt').style.pointerEvents = "all";
      } else if (this.tutorialPage === 4) {
        document.getElementById('hit-butt').style.pointerEvents = "none";
        document.getElementById('stand-butt').style.pointerEvents = "all";
      } else if (this.tutorialPage === 5) {
        document.getElementById('stand-butt').style.pointerEvents = "none";
        document.getElementById('tut-next-butt').style.display = "block";
      } else if (this.tutorialPage === 6) {
        document.getElementById('hit-butt').style.pointerEvents = "all";
        document.getElementById('double-butt').style.pointerEvents = "all";
        document.getElementById('stand-butt').style.pointerEvents = "all";
        document.getElementById('tut-next-butt').style.display = "none";
      } else if (this.tutorialPage === 7) {
        if (this.player.drawing) {
          // HIT
          document.getElementById('hit-butt').style.pointerEvents = "none";
          document.getElementById('double-butt').style.pointerEvents = "none";
        } else {
          // STAND OR DOUBLE
          document.getElementById('hit-butt').style.pointerEvents = "none";
          document.getElementById('double-butt').style.pointerEvents = "none";
          document.getElementById('stand-butt').style.pointerEvents = "none";
        }
      } else if (this.tutorialPage === 8) {
        document.getElementById('hit-butt').style.pointerEvents = "none";
        document.getElementById('double-butt').style.pointerEvents = "none";
        document.getElementById('stand-butt').style.pointerEvents = "none";
        document.getElementById('tut-next-butt').style.display = "block";
      } else if (this.tutorialPage === 10) {
        document.getElementById('help-butt').style.backgroundColor = "#1c893b";
        document.getElementById('help-butt').style.borderColor = "black";
        document.getElementById('help-butt').style.color = "black";
      } else if (this.tutorialPage >= this.tutorialPagesB.length) {
        document.getElementById('tutorial-contain').style.display = "none";
        document.getElementById('back-butt').style.display = "block";
        document.getElementById('help-butt').style.pointerEvents = "all";
        document.getElementById('hit-butt').style.pointerEvents = "all";
        document.getElementById('double-butt').style.pointerEvents = "all";
        document.getElementById('stand-butt').style.pointerEvents = "all";
        this.onboarded = true;
      }
    }

    this.tutorialPage += 1;
  }

  toggleInventory () {
    const inventory = document.getElementById('invent-contain');
    const exitButton = document.getElementById('invent-exit-button');

    if (exitButton.style.display === "none") {
      exitButton.style.display = "block";
    } else {
      exitButton.style.display = "none";
    }

    if (inventory.style.display === "none") {
      inventory.style.display = "block";

      this.populateInventory();
    } else {
      inventory.style.display = "none";
      this.depopulateInventory();
    }
  }

  depopulateInventory() {
    const inventChildren = document.getElementById("invent-contain").children;
    let inventElem = null;
    for (const child of inventChildren) {
      if (child.id === "inventory-main") {
        inventElem = child;
      }
    }
    inventElem.innerHTML = "";
  }

  populateInventory() {
    if (localStorage) {
      if (localStorage.getItem("items")) {
        let itemPaths = [];
  
        const inventChildren = document.getElementById("invent-contain").children;
        let inventElem = null;
        for (const child of inventChildren) {
          if (child.id === "inventory-main") {
            inventElem = child;
          }
        }
        
        const itemNames = Object.keys(this.items);
        
        itemNames.forEach(name => {
          if (this.items[name]['quantity'] > 0) {
            for (let i = 0; i < this.items[name]['quantity']; i++) {
              itemPaths.push([name, `Assets\\Cards\\Items\\${name}.png`]);
            }
          }
        });

        if (itemPaths.length !== 0) {
          for (let i = 0; i < itemPaths.length; i++) {
            let cardImg = document.createElement("img");
            cardImg.setAttribute("style", "width: 20%; margin: 1rem;");
            cardImg.setAttribute("src", itemPaths[i][1]);
            cardImg.setAttribute("onClick", `game.blackjackItem('${itemPaths[i][0]}')`);
            inventElem.appendChild(cardImg);
          }
        } else {
          inventElem.innerHTML = "Your inventory is empty.";
        }
      }
    }
  }

  // Item usage method
  blackjackItem(itemName) {
    // Regardless of the item used, inventory should go away
    this.toggleInventory();

    if (itemName === "aceUpYourSleeve") {
      // Manually draw an Ace of Hearts
      this.earn(this.player.drawSpecific(new Card("Hearts", 1)));

      this.suspicion += 5;
      this.items[itemName].quantity += 1;

      this.displayStats(false);
    } else if (itemName === "unoReverse") {
      // Switch all BlackjackPlayer fields except for the deck
      const playerPrevHand = this.player.hand;
      const playerPrevSum = this.player.sum;
      const playerPrevDrawing = this.player.drawing;
      const playerPrevDoubling = this.player.doubling;

      this.player.hand = this.house.hand;
      this.player.sum = this.house.sum;
      this.player.drawing = this.house.drawing;
      this.player.doubling = this.house.doubling;

      this.house.hand = playerPrevHand;
      this.house.sum = playerPrevSum;
      this.house.drawing = playerPrevDrawing;
      this.house.doubling = playerPrevDoubling;

      // this.suspicion += ???; TODO
      this.items[itemName].quantity -= 1;

      this.displayStats(true);
    } else if (itemName === "morph") {
      // Check for an ace in hand; replace with a random face card
      // If no ace hand in deck, give a descriptive failure message (in r-result text box)
      let replaceIdx = -1;
      for (let i = 0; i < this.player.hand.length; i++) {
        if (this.player.hand[i].getRank() === 'A') {
          // Picks the last ace in the current hand
          replaceIdx = i;
        }
      }

      if (replaceIdx !== -1) {
        const suit = this.player.hand[replaceIdx].getSuit();
        const validRanks = [11, 12, 13];

        this.player.hand.splice(replaceIdx, 1);
        this.earn(this.player.drawSpecific(new Card(suit, validRanks[Math.floor(Math.random() * validRanks.length)])));

        // this.suspicion += ???; TODO
        this.items[itemName].quantity -= 1;
        
        this.displayStats(true);
      } else {
        document.getElementById('r-result').innerHTML = 'No ace cards to Morph in the current hand!'

        setTimeout(() => {
          document.getElementById('r-result').innerHTML = '';
        }, 2000);
      }
    } else if (itemName === "PurpleChipCard") {
      this.playerTotalEarnings += 1000;
      this.items[itemName].quantity -= 1;

      this.displayStats(true);
    } else if (itemName === "futureSight") {
      if (this.peekedCard.getSuit() === "NULL") {
        this.peekedCard = this.player.peek();

        document.getElementById('r-result').innerHTML = `Future Sight: The next card is [${this.peekedCard.toString()}]`;
      }
    }
    
    // Always update because quantity will be updated most of the time
    this.updateLocalState();

    // Check if suspicion was surpassed
    if (this.checkSus()) {
      document.getElementById('id02').style.display='block';
    }
  }

  // Calculate suspicion gained from earnings
  // Method separated for ease of updating the math
  // Input: earnings (e.g. for a round)
  calcSus(earnings) {
    let day = 1;
    if (localStorage && localStorage.getItem('day')) {
      day = localStorage.getItem('day');
    }

    // 1/50 x 1/[day]^2.275 suspicion gained per dollar
    return earnings * ((1.0/50.0) * (1.0/(Math.pow((day * 1.0), 2.275))));
  }

  // Update localStorage with player state information
  updateLocalState() {
    if (localStorage) {
      localStorage.setItem('totalEarnings', String(this.playerTotalEarnings));
      localStorage.setItem('dailyEarnings', String(this.playerDailyEarnings));
      localStorage.setItem('blackjack', JSON.stringify({
          "multiplier": this.playerBaseMult,
          "strangerInteraction1": this.strangerInteraction1,
          "abTutorialTester": this.abTutorialTester,
          "onboarded": this.onboarded
      }));
      localStorage.setItem('suspicion', String(this.suspicion));
      localStorage.setItem('items', JSON.stringify(this.items));
    }
  }

  // Prompts user for input and computes corresponding outcomes
  // Param: string to represent which button the player clicked
  playerMove(move) {
    switch (move) {
      case 'hit':
        if (this.peekedCard.getSuit() === "NULL") {
          if (!this.onboarded) {
            if (this.tutorialPage === 4) {
              this.earn(this.player.drawSpecific(new Card("Hearts", 7)));
              this.progressTutorial();
            } else if (this.tutorialPage === 7) {
              this.earn(this.player.drawSpecific(new Card("Clubs", 3)));
              this.progressTutorial();
            }
          } else {
            this.earn(this.player.draw());
          }
        } else {
          this.earn(this.player.drawSpecific(this.peekedCard));
          this.peekedCard = new Card("NULL", 0);
        }

        break;
      case 'stand':
        if (!this.onboarded) {
          if (this.tutorialPage === 5) {
            this.progressTutorial();
          } else if (this.tutorialPage === 7) {
            this.progressTutorial();
            this.progressTutorial();
          } else if (this.tutorialPage === 8) {
            this.progressTutorial();
          }
        }

        this.player.drawing = false;
        break;
      case 'double':
        this.player.doubling = true;
        if (this.peekedCard.getSuit() === "NULL") {
          if (!this.onboarded) {
            if (this.tutorialPage === 8) {
              this.earn(this.player.drawSpecific(new Card("Diamonds", 2)));
              this.progressTutorial();
            } else if (this.tutorialPage === 7) {
              this.earn(this.player.drawSpecific(new Card("Clubs", 2)));
              this.progressTutorial();
              this.progressTutorial();
            }
          } else {
            this.earn(this.player.draw());
          }
        } else {
          this.earn(this.player.drawSpecific(this.peekedCard));
          this.peekedCard = new Card("NULL", 0); // Sanity reset (technically redundant)
        }
        this.player.drawing = false;
        break;
      default:
        console.log('Invalid input!\n')
    }

    if (this.player.checkBust()) {
      this.player.drawing = false;

      // true indicates that the round is already over
      this.houseLoop(true);

    } else if (!this.player.drawing) {
      // false indicates that round completion depends on house moves
      this.houseLoop(false);
    } else {
      this.displayStats(false);
    }

    this.updateLocalState();
  }

  // Determines the next choice for house and executes it
  // Return: checkBust() result - i.e. true if house busts
  houseMove() {
    if (!this.onboarded) {
      this.house.drawSpecific(new Card("Spades", 1));
      this.house.drawing = false;
    } else {
      // 'hit' while below 17 and losing; stand otherwise
      if (this.house.sum < 17 && this.house.sum < this.player.sum) {
        this.house.draw();
      } else if (this.house.sum < 16 && this.house.sum === this.player.sum) {
        this.house.draw();
      } else {
        this.house.drawing = false;
      }
    }

    return this.house.checkBust();
  }

  // Displays game state values on front-end
  displayStats(shouldForceReset) {
    document.getElementById('sbar').innerHTML = `Wallet: $${(this.playerTotalEarnings - this.playerSpentMoney).toFixed(2)} <br> Current Hand: <br> +($${this.playerCurrentEarnings.toFixed(2)} x ${this.playerBaseMult.toFixed(1)})`;

    const pCardPaths = this.player.handToCards();
    const pHandElem = document.getElementById("p-hand");

    if (shouldForceReset) {
      pHandElem.innerHTML = '';
    }
    
    for (let i = pHandElem.childNodes.length; i < pCardPaths.length; i++) {
      let cardImg = document.createElement("img");
      cardImg.setAttribute("class", "player-card");
      cardImg.setAttribute("src", pCardPaths[i]);
      cardImg.setAttribute("height", "100%");
      pHandElem.appendChild(cardImg);
    }
    
    const hCardPaths = this.house.handToCards();
    const hHandElem = document.getElementById("h-hand");
    
    if (shouldForceReset) {
      hHandElem.innerHTML = '';
    }

    for (let i = hHandElem.childNodes.length; i < hCardPaths.length; i++) {
      let cardImg = document.createElement("img");
      cardImg.setAttribute("class", "house-card");
      cardImg.setAttribute("src", hCardPaths[i]);
      cardImg.setAttribute("height", "100%");
      hHandElem.appendChild(cardImg);
    }
  }

  // Sanity check; rescores a hand (useful for items later)
  // Param: generally this.houseHand or this.playerHand
  // Return: score of input hand
  computeHand(hand) {
    let output = 0;

    hand.forEach(card => {
      output += card.getScore();
    });

    return output;
  }
}

// House/Player; has a deck, hand, and round sum
class BlackjackPlayer {
  // this.drawing is true unless the player stands/doubles
  constructor() {
    this.deck = new Deck();
    this.hand = [];
    this.sum = 0;
    this.drawing = true;
    this.doubling = false;
  }

  // Resets deck; empties hand/resets sum
  reset() {
    this.deck.resetDeck();
    this.hand = [];
    this.sum = 0;
    this.drawing = true;
  }

  // Draws a card, adds to sum, and updates hand
  // Return: drawn card object for potential scoring computations
  draw() {
    // Pick random available card
    const drawnCard = this.deck.draw();

    // Increment sum
    this.sum += drawnCard.getScore();

    // Add to hand
    this.hand.push(drawnCard);

    // Return card for earning computation
    return drawnCard;
  }

  peek() {
    // Pick random available card
    const drawnCard = this.deck.draw();

    // Return card for earning computation
    return drawnCard;
  }

  drawSpecific(card) {
    // Increment sum
    this.sum += card.getScore();

    // Add to hand
    this.hand.push(card);

    return card;
  }

  // Checks for bust condition (>21)
  checkBust() {
    return this.sum > 21;
  }

  // Return: readable string representation of hand
  handToString() {
    const output = [];
    this.hand.forEach(card => {
      output.push(card.getRank());
    });
    return `[ ${output} ]`;
  }

  // Return: array of image file names corresponding to cards
  handToCards() {
    const output = [];
    this.hand.forEach(card => {
      output.push(`Assets\\Cards\\${card.getSuit()}\\${card.getSuit()}${card.getRank()}.png`);
    });
    return output;
  }
}

const game = new Blackjack();

const audio = document.getElementById('background-music');
const muteButton = document.getElementById('mute-button');

function checkAudio() {
  if (localStorage.getItem('muted') == null) {
    localStorage.setItem('muted', 'false');
    audio.muted = false;
    muteButton.src = "Assets/Music/music_playing.png";
  }

  if (localStorage && localStorage.getItem('muted') == 'true') {
    audio.muted = true;
    muteButton.src = "Assets/Music/music_muted.png";
  } else {
    audio.muted = false;
    muteButton.src = "Assets/Music/music_playing.png";
  }
}

checkAudio();

muteButton.addEventListener('click', () => {
  if (audio.muted) {
    audio.muted = false;
    muteButton.src = "Assets/Music/music_playing.png";
    localStorage.setItem('muted', 'false');
  } else {
    audio.muted = true;
    muteButton.src = "Assets/Music/music_muted.png";
    localStorage.setItem('muted', 'true');
  }
});