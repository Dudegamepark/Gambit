function initialize() {
    // Default values; if player state hasn't been updated
    this.totalWallet = 0.0;
    let days = 30;
    let suspicion = 0;
    this.totalSpent = 0.0;

    this.items = {
      'lowCard': {
        "description": "Submitting a High Card hand reduces Suspicion by -5 (to a maximum of -10 per game and -50 per day)",
        "quantity": 0,
        "type": "permanent",
        "cost": 600
      },
      'tearAwayTux': {
        "description": "Resets Suspicion meter to 50% the first time it rises above 100% and is consumed in the process",
        "quantity": 0,
        "type": "disguise",
        "cost": 3000
      },
      'aceUpYourSleeve': {
        "description": "The next card you draw to be an ace of hearts.",
        "quantity": 0,
        "type": "consumable",
        "cost": 50
      },
      'unoReverse': {
        "description": "Switch your hand with the dealer's instead!",
        "quantity": 0,
        "type": "consumable",
        "cost": 200
      },
      'CheeseHatCard': {
        "description": "Cheese disguise",
        "quantity": 0,
        "type": "disguise",
        "cost": 0
      },
      'futureSight': {
        "description": "See what your next card will be!",
        "quantity": 0,
        "type": "consumable",
        "cost": 250
      },
      'jackBlack': {
        "description": "you're literally him!!!",
        "quantity": 0,
        "type": "disguise",
        "cost": 0
      },
      'morph': {
        "description": "Turns an Ace into a 10/face card",
        "quantity": 0,
        "type": "consumable",
        "cost": 125
      },
      'PurpleChipCard': {
        "description": "Gives you 1000 dollars",
        "quantity": 0,
        "type": "consumable",
        "cost": 1000
      },
    }
    
    // Check player spending value
    if (localStorage && localStorage.getItem('spentMoney')) {
      this.totalSpent = Number(localStorage.getItem('spentMoney'));
    }
  
    // Check for nonzero earnings value
    if (localStorage && localStorage.getItem('totalEarnings')) {
      this.totalWallet = Number(localStorage.getItem('totalEarnings'));
      this.totalWallet -= this.totalSpent;
    }

    // Check day count
    if (localStorage && localStorage.getItem('days')) {
      days = Number(localStorage.getItem('days'));
    }
  
    // Check for nonzero suspicion
    if (localStorage && localStorage.getItem('suspicion')) {
      suspicion = Number(localStorage.getItem('suspicion'));
    }

    if (localStorage && localStorage.getItem('items')) {
      this.items = JSON.parse(localStorage.getItem('items'));
    }

    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    document.getElementById('aceBuy').innerHTML = `Purchase: $${50 + 2 * (30 - days)}`;

    const lowCardImage = document.getElementById('lcpowerup');
    const tuxImage = document.getElementById('tuxpowerup');
    const cardImage = document.getElementById('cardpowerup');
    const unoImage = document.getElementById('unopowerup');
    const futureImage = document.getElementById('futurepowerup');
    const morphImage = document.getElementById('morphpowerup');

    // Has the player already purchased the item?

    if (this.items['tearAwayTux'].quantity > 0) {
      document.getElementById('tuxpowerup').style.display = 'none';
    }

    if (this.items['lowCard'].quantity > 0) {
      document.getElementById('lcpowerup').style.display = 'none';
    }

    // Open popup when player clicks on item
    if (lowCardImage) {
        lowCardImage.addEventListener('click', openPopup);
    }
    if (tuxImage) {
      tuxImage.addEventListener('click', openPopup);
    }
    if (cardImage) {
      cardImage.addEventListener('click', openPopup);
    }
    if (unoImage) {
      unoImage.addEventListener('click', openPopup2);
    }
    if (futureImage) {
      futureImage.addEventListener('click', openPopup3);
    }
    if (morphImage) {
      morphImage.addEventListener('click', openPopup4);
    }
}
  

function openPopup() {
    popup = document.getElementById('upgrade-popup');
    if (popup) {
        popup.style.display = 'flex';
    }
    popup = document.getElementById('tux-popup');
    if (popup) {
        popup.style.display = 'flex';
    }
    popup = document.getElementById('card-popup');
    if (popup) {
        popup.style.display = 'flex';
    }
}

function openPopup2() {
  popup = document.getElementById('uno-popup');
  if (popup) {
      popup.style.display = 'flex';
  }
}

function openPopup3() {
  popup = document.getElementById('future-popup');
  if (popup) {
      popup.style.display = 'flex';
  }
}

function openPopup4() {
  popup = document.getElementById('morph-popup');
  if (popup) {
      popup.style.display = 'flex';
  }
}

function closePopup() {
  popup = document.getElementById('upgrade-popup');
  if (popup) {
      popup.style.display = 'none';
  }
  popup = document.getElementById('tux-popup');
  if (popup) {
      popup.style.display = 'none';
  }
  popup = document.getElementById('card-popup');
  if (popup) {
      popup.style.display = 'none';
  }
  popup = document.getElementById('uno-popup');
  if (popup) {
      popup.style.display = 'none';
  }
  popup = document.getElementById('future-popup');
  if (popup) {
      popup.style.display = 'none';
  }
  popup = document.getElementById('morph-popup');
  if (popup) {
      popup.style.display = 'none';
  }
}

initialize();

// Purchasing from Card Powerup
function purchaseCard() {
  let day = 30;
  if (localStorage && localStorage.getItem('day')) {
      day = localStorage.getItem('day');
  }
  let price = 50 + 2 * (30 - day);
  purchase = document.getElementById('card-popup');
  if (purchase && this.totalWallet >= price) {
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['aceUpYourSleeve'].quantity += 1;
    if (this.items['aceUpYourSleeve'].quantity >= 4) {
      document.getElementById('cardpowerup').style.display = 'none';
    }
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
    localStorage.setItem('spentMoney', this.totalSpent);
    dataLayer.push({
      event: 'AceUp_purchase',
    });
    closePopup();
  }
}

// Purchasing from Card Powerup
function purchaseUno() {
  purchase = document.getElementById('uno-popup');
  let price = 200;
  if (purchase && this.totalWallet >= price) {
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['unoReverse'].quantity += 1;
    if (this.items['unoReverse'].quantity >= 4) {
      document.getElementById('unopowerup').style.display = 'none';
    }
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('spentMoney', this.totalSpent);
      dataLayer.push({
        event: 'uno_purchase',
      });
    closePopup();
  }
}

// Purchasing from Card Powerup
function purchaseFuture() {
  purchase = document.getElementById('future-popup');
  let price = 250;
  if (purchase && this.totalWallet >= price) {
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['futureSight'].quantity += 1;
    if (this.items['futureSight'].quantity >= 4) {
      document.getElementById('futurepowerup').style.display = 'none';
    }
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('spentMoney', this.totalSpent);
      dataLayer.push({
        event: 'future_purchase',
      });
    closePopup();
  }
}

// Purchasing from Card Powerup
function purchaseMorph() {
  purchase = document.getElementById('morph-popup');
  let price = 125;
  if (purchase && this.totalWallet >= price) {
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['morph'].quantity += 1;
    if (this.items['morph'].quantity >= 4) {
      document.getElementById('morphpowerup').style.display = 'none';
    }
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('spentMoney', this.totalSpent);
      dataLayer.push({
        event: 'morph_purchase',
      });
    closePopup();
  }
}

// Purchasing from Disguise Powerup
function purchaseTux() {
  purchase = document.getElementById('tux-popup');
  let price = 3000;
  if (purchase && this.totalWallet >= price) {
    item = document.getElementById('tuxpowerup');
    item.style.display = 'none';
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['tearAwayTux'].quantity = 1;
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('spentMoney', this.totalSpent);
      dataLayer.push({
        event: 'tearAway_purchase',
      });
    closePopup();
  }
}

// Purchasing from Upgrade Powerup
function purchaseUpgrade() {
  purchase = document.getElementById('upgrade-popup'); 
  let price = 600;
  if (purchase && this.totalWallet >= price) {
    document.getElementById('lcpowerup').style.display = 'none';
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['lowCard'].quantity = 1;
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
    localStorage.setItem('spentMoney', this.totalSpent);
    dataLayer.push({
      event: 'lowCard_purchase',
    });
    closePopup();
  }
}

// Update wallet
function updateWallet() {
  localStorage.setItem('spentMoney', totalSpent);
  localStorage.setItem('items', JSON.stringify(this.items));
}
