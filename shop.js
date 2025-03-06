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
  }
  
  initialize();

