// Playing card class; suits and ranks
class Card {
  // Note that the constructor is not 
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  // Return: the Poker score for this card
  getScore() {
    if (this.rank > 10) {
      return 10;
    } else if (this.rank === 1) {
      return 11;
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
  // Try not to use this method outside the Poker class
  draw() {
    const drawIndex = Math.floor(Math.random() * this.cards.length);
    const drawnCard = this.cards[drawIndex];
    this.cards.splice(drawIndex, 1);
    
    return drawnCard;
  }
}

// Poker game-running class
class Poker {
  constructor() {
    this.deck = new Deck();
    this.hand = [];

    // Additional player stats
    this.playerCurrentEarnings = 0.0;

    // Transient Variables:
    // 'multi hot encoded' (local) array (1 = discard)
    this.selectedCards = [0, 0, 0, 0, 0]
    
    // used for visualization and round completion (sus/mult math)
    this.currHand = "High Card";

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

    if (localStorage && localStorage.getItem('poker')) {
      const stats = JSON.parse(localStorage.getItem('poker'));
      this.playerBaseMult = stats.multiplier;
      this.discards = stats.discards;
    } else {
      this.playerBaseMult = 1.0;
      this.discards = 3;
    }

    this.resetTable();
  }

  // Reshuffle the deck and draw 5 random cards into hand
  resetTable() {
    this.deck.resetDeck();
    this.hand = [];
    
    // Draw 5 random cards into hand
    for (let i = 0; i < 5; i++) {
      this.draw();
    }

    this.score();
  }

  // Helper function for computing reward of a hand
  // Param: score corresponding to hand, multiplier corresponding to hand
  computeReward(handScore, handMult) {
    return (this.scoreHand() + handScore) * handMult;
  }

  // Helper function to compute the sum of card scores in current hand
  scoreHand() {
    let sum = 0;

    for (const card of this.hand) {
      sum += card.getScore();
    }

    return sum;
  }

  // Calculate hand score based on poker hands; update currentEarnings only
  score() {
    console.log(`Checking: ${this.handToString()}`)

    let isFlush = this.checkFlush(this.hand);
    let isStraight = this.checkStraight(this.hand);
    let cardNumList = [];
    let occurrences = {};

    // Generate an array of only raw card numbers (.rank values)
    this.hand.forEach(card => {
      cardNumList.push(card.rank);
    });
    
    // e.g. [1, 10, 11, 12, 13]
    cardNumList.sort((function(a, b) {
      return a - b;
    }));

    // Generate an object with a count of occurrences of raw card numbers
    for (const num of cardNumList) {
      occurrences[num] = occurrences[num] ? occurrences[num] + 1 : 1;
    }

    // vvv BASEMULT + x0.5 | +3 SUSPICION vvv
    // 1 Royal Flush - (score + 150) x 2.5
    // 2 Straight Flush - (score + 100) x 2.0
    // 3 Four of a Kind - (score + 80) x 1.9
    if (isFlush && isStraight && cardNumList.includes(1) && cardNumList.includes(13)) {
      // Royal Flush
      this.playerCurrentEarnings = this.computeReward(150, 2.5);

      this.currHand = "Royal Flush";
    } else if (isFlush && isStraight) {
      // Straight Flush
      this.playerCurrentEarnings = this.computeReward(100, 2.0);

      this.currHand = "Straight Flush";
    } else if (Object.values(occurrences).includes(4)) {
      // Four of a Kind
      this.playerCurrentEarnings = this.computeReward(80, 1.9);

      this.currHand = "Four of a Kind";
    }

    // vvv BASEMULT + x0.2 | +2 SUSPICION vvv
    // 4 Full House - (score + 50) x 1.7
    // 5 Flush - (score + 40) x 1.6
    // 6 Straight - (score + 40) x 1.5
    // 7 Three of a Kind - (score + 30) x 1.4
    else if (Object.values(occurrences).includes(3) && Object.values(occurrences).includes(2)) {
      // Full House
      this.playerCurrentEarnings = this.computeReward(50, 1.7);

      this.currHand = "Full House";
    } else if (isFlush) {
      // Flush
      this.playerCurrentEarnings = this.computeReward(40, 1.6);

      this.currHand = "Flush";
    } else if (isStraight) {
      // Straight
      this.playerCurrentEarnings = this.computeReward(40, 1.5);

      this.currHand = "Straight";
    } else if (Object.values(occurrences).includes(3)) {
      // Three of a Kind
      this.playerCurrentEarnings = this.computeReward(30, 1.4);

      this.currHand = "Three of a Kind";
    }

    // vvv RESET BASEMULT | +1 SUSPICION vvv
    // 8 Two Pair - (score + 20) x 1.2
    // 9 Pair - (score + 15) x 1.1
    // 10 High Card - (score + 10) x 1.0
    else if (this.countInArray(Object.values(occurrences), 2) === 2) {
      // Two Pair
      this.playerCurrentEarnings = this.computeReward(20, 1.2);

      this.currHand = "Two Pair";
    } else if (Object.values(occurrences).includes(2)) {
      // Pair
      this.playerCurrentEarnings = this.computeReward(15, 1.1);

      this.currHand = "Pair";
    } else {
      // High Card
      this.playerCurrentEarnings = this.computeReward(10, 1.0);

      this.currHand = "High Card";
    }
  }

  // Draw a card from the deck into hand
  draw() {
    // Add random available card to hand
    const drawnCard = this.deck.draw();
    this.hand.push(drawnCard);
  }

  // Helper function for comparing array equality
  // Params: array 1, array 2
  arrayEquals(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    
    return true;
  }

  // Helper function for checking if a hand is a 'flush'
  // Params: hand to check
  checkFlush(hand) {
    // Check for flush
    const suitRef = hand[0].getSuit();
    for (const card of hand) {
      if (card.getSuit() !== suitRef) {
        return false;
      }
    }

    return true;
  }

  // Helper function for checking if a hand is a 'straight'
  // Params: hand to check
  checkStraight(hand) {
    // Check for straight; .rank gives 1-13 value
    const cardNumList = [];
    hand.forEach(card => {
      cardNumList.push(card.rank);
    });
    
    cardNumList.sort((function(a, b) {
      return a - b;
    }));

    // First, check for the special 10-11-12-13-1 straight condition
    if (this.arrayEquals(cardNumList, [1, 10, 11, 12, 13])) {
      return true;
    } else {
      // Check for usual straight condition via looping
      for (let i = 0; i < cardNumList.length - 1; i++) {
        if (cardNumList[i + 1] - cardNumList[i] != 1) {
          return false;
        }
      }
    }

    return true;
  }

  // Helper function to count number of occurrences of a value in an array
  // Param: array to check, value to find
  countInArray(array, value) {
    var count = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) {
            count++;
        }
    }
    return count;
  }
  
  // Setter function to toggle card select in hand
  // Param: which card to toggle select (must be 0-4)
  toggleSelectCard(card_idx) {
    if (selectedCards[card_idx] === 0) {
      selectedCards[card_idx] = 1;
    } else if (selectedCards[card_idx] === 1) {
      selectedCards[card_idx] = 0;
    } else {
      console.log("Something went terribly wrong in toggleSelectCard...");
    }
  }

  // Discard chosen cards from the hand (draw new random cards)
  discard() {
    for (let i = 0; i < this.hand.length; i++) {
      if (this.selectedCards[i] === 1) {
        this.hand[i] = this.deck.draw();
      }
    }

    // Update relevant fields
    this.selectedCards = [0, 0, 0, 0, 0];
    this.discards -= 1;
    this.score(); // To update current earnings

    // If no more discards left, automatically complete round
    if (this.discards === 0) {
      this.confirmHand();
    }
  }

  // Scores hand and resets fields
  confirmHand() {
    this.playerTotalEarnings += this.playerCurrentEarnings * this.playerBaseMult;
    this.playerDailyEarnings += this.playerCurrentEarnings * this.playerBaseMult;
    
    // Baseline increments to suspicion/baseMult based on quality of hand
    if (["Royal Flush", "Straight Flush", "Four of a Kind"].includes(this.currHand)) {
      this.playerBaseMult += 0.5;
      this.suspicion += 3;
    } else if (["Full House", "Flush", "Straight", "Three of a Kind"].includes(this.currHand)) {
      this.playerBaseMult += 0.2;
      this.suspicion += 2;
    } else if (["Two Pair", "Pair", "High Card"].includes(this.currHand)) {
      this.playerBaseMult = 1.0;
      this.suspicion += 1;
    } else {
      console.log("Something went horribly wrong in confirmHand...");
    }

    this.suspicion += this.calcSus(this.playerCurrentEarnings * this.playerBaseMult);

    // Restore defaults of fields and reset the table
    setTimeout(() => {
      this.playerCurrentEarnings = 0.0;
      this.selectedCards = [0, 0, 0, 0, 0]
      this.currHand = "High Card";
      
      this.updateLocalState();

      this.resetTable();
    }, 2000);
  }

  // Update localStorage with player state information
  updateLocalState() {
    if (localStorage) {
      localStorage.setItem('totalEarnings', String(this.playerTotalEarnings));
      localStorage.setItem('dailyEarnings', String(this.playerDailyEarnings));
      localStorage.setItem('poker', JSON.stringify({
          "multiplier": this.playerBaseMult,
          "discards": this.discards
      }));
      localStorage.setItem('suspicion', String(this.suspicion));
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

  handToString() {
    return `${this.hand[0].getRank()}${this.hand[0].getSuit()}`
            + ` - ${this.hand[1].getRank()}${this.hand[1].getSuit()}`
            + ` - ${this.hand[2].getRank()}${this.hand[2].getSuit()}`
            + ` - ${this.hand[3].getRank()}${this.hand[3].getSuit()}`
            + ` - ${this.hand[4].getRank()}${this.hand[4].getSuit()}`;
  }
}

const p = new Poker();