function initialize() {
    // Default values; if player state hasn't been updated
    let totalWallet = 0.0;
    let suspicion = 0;
  
    // Check for nonzero earnings value
    if (localStorage && localStorage.getItem('totalEarnings')) {
      totalWallet = Number(localStorage.getItem('totalEarnings'));
    }
  
    // Check for nonzero suspicion
    if (localStorage && localStorage.getItem('suspicion')) {
      suspicion = Number(localStorage.getItem('suspicion'));
    }
  
    document.getElementById('money-won-box').innerHTML = `Cash Won: $${totalWallet.toFixed(0)}`;

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

