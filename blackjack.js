
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
    } else {
      this.playerBaseMult = 1.0;
      this.strangerInteraction1 = false;
    }

    this.resetRound();
  }

  // Resets decks and empties hands
  // To be called after every round of 21
  // Also call this to start the game
  resetRound() {
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
    this.displayStats();
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

    // TODO: Find a place to display the final hands information; maybe at the bottom of sidebar?
    document.getElementById('fbar').innerHTML = `Final Hands: </br> YOU (${this.player.sum}): </br> ${this.player.handToString()} </br> </br> HOUSE (${this.house.sum}): </br>${this.house.handToString()}`;

    this.completeRound();

    document.getElementById('sbar').innerHTML = `Total Earnings: ${this.playerTotalEarnings} (+${this.playerBaseMult * this.playerCurrentEarnings}) - Multiplier: ${this.playerBaseMult}`;

    this.resetRound();
  }

  // Updates earnings/base multiplier based on final state; resets round afterward
  completeRound() {
    if (this.player.checkBust()) {
      // Lose condition 1: player bust
      // baseMult = 1.0; round earnings = 0
      this.playerBaseMult = 1.0;
      console.log('You lose!');

    } else if (this.house.checkBust() || this.player.sum > this.house.sum) {
      // Win conditions: house bust or player sum is higher
      // baseMult increments; round earnings multiplied by base and added to total
      this.playerTotalEarnings += this.playerCurrentEarnings * this.playerBaseMult;
      this.playerDailyEarnings += this.playerCurrentEarnings * this.playerBaseMult;
      // if they have not interacted with the stranger
      if (!this.strangerInteraction1) {
        // npc box pops up
        document.getElementById('id01').style.display='block';
      }
      this.strangerInteraction1 = true;
      
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
      // TODO: check if suspicion is greater than 100
      // if yes, change to game loss screen
      console.log('You win!');

    } else if (this.house.sum > this.player.sum) {
      // Lose condition 2: house sum is higher
      // baseMult = 1.0; round earnings = 0
      this.playerBaseMult = 1.0;
      console.log('You lose!');
    } else if (this.house.sum === this.player.sum) {
      // Tie condition: house and player sums are equal
      // baseMult is retained; add round earnings / 2 to total
      // Suspicion increments by money gained

      this.playerTotalEarnings += (this.playerCurrentEarnings * this.playerBaseMult) / 2;
      this.playerDailyEarnings += (this.playerCurrentEarnings * this.playerBaseMult) / 2;
      this.suspicion += this.calcSus((this.playerCurrentEarnings * this.playerBaseMult) / 2);
      // TODO: check if suspicion is greater than 100
      // if yes, change to game loss screen
      console.log('You tied!');
      // if they have not interacted with the stranger
      if (!this.strangerInteraction1) {
        // npc box pops up
        document.getElementById('id01').style.display='block';
      }
      this.strangerInteraction1 = true;

    } else {
      // Sanity case
      console.log('Something went horribly wrong in completeRound()...')
    }

    // General reset steps; everything has been incremented
    this.playerCurrentEarnings = 0;
    this.updateLocalState();
    console.log(localStorage.getItem('suspicion'));
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
          "strangerInteraction1": this.strangerInteraction1
      }));
      localStorage.setItem('suspicion', String(this.suspicion));
    }
  }

  // Prompts user for input and computes corresponding outcomes
  // Param: string to represent which button the player clicked
  playerMove(move) {
    switch (move) {
      case 'hit':
        this.earn(this.player.draw());
        break;
      case 'stand':
        this.player.drawing = false;
        break;
      case 'double':
        this.player.doubling = true;
        this.earn(this.player.draw())
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
      this.displayStats();
    }

    this.updateLocalState();
  }

  // Determines the next choice for house and executes it
  // Return: checkBust() result - i.e. true if house busts
  async houseMove() {
    // 'hit' while below 17 and losing; stand otherwise
    if (this.house.sum < 17 && this.house.sum < this.player.sum) {
      this.house.draw();
    } else if (this.house.sum < 16 && this.house.sum === this.player.sum) {
      this.house.draw();
    } else {
      this.house.drawing = false;
    }

    return this.house.checkBust();
  }

  // TODO: maintain as front-end is updated
  // Displays game state values on front-end
  displayStats() {
    document.getElementById('sbar').innerHTML = `Wallet: $${this.playerTotalEarnings.toFixed(2)} <br> Current Hand: <br> +($${this.playerCurrentEarnings.toFixed(2)} x ${this.playerBaseMult.toFixed(1)})`;

    const pCardPaths = this.player.handToCards();
    const pHandElem = document.getElementById("p-hand");

    for (let i = pHandElem.childNodes.length; i < pCardPaths.length; i++) {
      let cardImg = document.createElement("img");
      cardImg.setAttribute("class", "player-card");
      cardImg.setAttribute("src", pCardPaths[i]);
      cardImg.setAttribute("height", "100%");
      pHandElem.appendChild(cardImg);
    }

    const hCardPaths = this.house.handToCards();
    const hHandElem = document.getElementById("h-hand");

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