function initialize() {
    // Default values; if player state hasn't been updated
    let totalWallet = 0.0;
    let days = 30;
    let suspicion = 0;
  
    // Check for nonzero earnings value
    if (localStorage && localStorage.getItem('totalEarnings')) {
      totalWallet = Number(localStorage.getItem('totalEarnings'));
    }

    if (localStorage && localStorage.getItem('days')) {
      days = Number(localStorage.getItem('days'));
    }
  
    // Check for nonzero suspicion
    if (localStorage && localStorage.getItem('suspicion')) {
      suspicion = Number(localStorage.getItem('suspicion'));
    }

    document.getElementById('money-won-box').innerHTML = `Cash Won: $${totalWallet.toFixed(0)}`;
    document.getElementById('aceBuy').innerHTML = `Purchase: $${50 + 2 * (30 - days)}`;
    document.getElementById('weightBuy').innerHTML = `Purchase: $${50 + 2 * (30 - days)}`;

    const lowCardImage = document.getElementById('lcpowerup');
    const weightDieImage = document.getElementById('dicepowerup');
    const tuxImage = document.getElementById('tuxpowerup');
    const cardImage = document.getElementById('cardpowerup');

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
  purchase = document.getElementById('card-popup');
  if (purchase) {
    item = document.getElementById('cardpowerup');
    item.style.display = 'none';
    closePopup();
  }
}

function purchaseTux() {
  purchase = document.getElementById('tux-popup');
  if (purchase) {
    item = document.getElementById('tuxpowerup');
    item.style.display = 'none';
    closePopup();
  }
}

function purchaseDice() {
  purchase = document.getElementById('dice-popup'); 
  if (purchase) {
    item = document.getElementById('dicepowerup');
    item.style.display = 'none';
    closePopup();
  }
}

function purchaseUpgrade() {
  purchase = document.getElementById('upgrade-popup'); 
  if (purchase) {
    document.getElementById('lcpowerup').style.display = 'none';
    closePopup();
  }
}

