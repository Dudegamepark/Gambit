function initialize() {
    // Default values; if player state hasn't been updated
    this.totalWallet = 0.0;
    let days = 30;
    let suspicion = 0;
    this.totalSpent = 0.0;
    this.items = {
      'lowCard': "0",
      'weightDie': {
        "days": "0",
        "quantity": "0"
      },
      'tux': "0",
      'card': {
        "days": "0",
        "quantity": "0"
      }
    }

    if (localStorage && localStorage.getItem('spentMoney')) {
      this.totalSpent = Number(localStorage.getItem('spentMoney'));
    }
  
    // Check for nonzero earnings value
    if (localStorage && localStorage.getItem('totalEarnings')) {
      this.totalWallet = Number(localStorage.getItem('totalEarnings'));
      this.totalWallet -= totalSpent;
    }

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
    document.getElementById('weightBuy').innerHTML = `Purchase: $${50 + 2 * (30 - days)}`;

    const lowCardImage = document.getElementById('lcpowerup');
    const weightDieImage = document.getElementById('dicepowerup');
    const tuxImage = document.getElementById('tuxpowerup');
    const cardImage = document.getElementById('cardpowerup');

    if (this.items['card'].days == days && this.items['card'].quantity >= 4) {
      document.getElementById('cardpowerup').style.display = 'none';
    }

    if (this.items['tux'] > 0) {
      document.getElementById('tuxpowerup').style.display = 'none';
    }

    if (this.items['weightDie'].days == days && this.items['weightDie'].quantity >= 4) {
      document.getElementById('dicepowerup').style.display = 'none';
    }

    if (this.items['lowCard'] > 0) {
      document.getElementById('lcpowerup').style.display = 'none';
    }

    if (lowCardImage) {
        lowCardImage.addEventListener('click', openPopup);
    }
    if (weightDieImage) {
      weightDieImage.addEventListener('click', openPopup);
    }
    if (tuxImage) {
      tuxImage.addEventListener('click', openPopup);
    }
    if (cardImage) {
      cardImage.addEventListener('click', openPopup);
    }
}
  

function openPopup() {
    popup = document.getElementById('upgrade-popup');
    if (popup) {
        popup.style.display = 'flex';
    }
    popup = document.getElementById('dice-popup');
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

function closePopup() {
  popup = document.getElementById('upgrade-popup');
  if (popup) {
      popup.style.display = 'none';
  }
  popup = document.getElementById('dice-popup');
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
}

initialize();

function purchaseCard() {
  let day = 30;
  if (localStorage && localStorage.getItem('day')) {
      day = localStorage.getItem('day');
  }
  let price = 50 + 2 * (30 - day);
  purchase = document.getElementById('card-popup');
  if (purchase && this.totalWallet >= price) {
    item = document.getElementById('cardpowerup');
    item.style.display = 'none';
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['card'].days = day;
    this.items['card'].quantity += 1;
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
    localStorage.setItem('spentMoney', this.totalSpent);
    closePopup();
  }
}

function purchaseTux() {
  purchase = document.getElementById('tux-popup');
  let price = 3000;
  if (purchase && this.totalWallet >= price) {
    item = document.getElementById('tuxpowerup');
    item.style.display = 'none';
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['tux'] = 1;
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('spentMoney', this.totalSpent);
    closePopup();
  }
}

function purchaseDice() {
  let day = 30;
  if (localStorage && localStorage.getItem('day')) {
      day = localStorage.getItem('day');
  }
  let price = 50 + 2 * (30 - day);
  purchase = document.getElementById('dice-popup');
  if (purchase && this.totalWallet >= price) {
    item = document.getElementById('dicepowerup');
    item.style.display = 'none';
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['weightDie'].days = day;
    this.items['card'].quantity += 1;
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
    localStorage.setItem('spentMoney', this.totalSpent);
    closePopup();
  }
}

function purchaseUpgrade() {
  purchase = document.getElementById('upgrade-popup'); 
  let price = 600;
  if (purchase && this.totalWallet >= price) {
    document.getElementById('lcpowerup').style.display = 'none';
    this.totalWallet -= price;
    this.totalSpent += price;
    this.items['lowCard'] = 1;
    document.getElementById('money-won-box').innerHTML = `Wallet: $${this.totalWallet.toFixed(0)}`;
    localStorage.setItem('items', JSON.stringify(this.items));
    localStorage.setItem('spentMoney', this.totalSpent);
    closePopup();
  }
}

function updateWallet() {
  localStorage.setItem('spentMoney', totalSpent);
  localStorage.setItem('items', JSON.stringify(this.items));
}
