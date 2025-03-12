function initialize() {
  // Default values; if player state hasn't been updated
  let totalEarnings = 0.0;
  let days = 30;
  let suspicion = 0;
  let spentMoney = 0;

  // Check for nonzero earnings value
  if (localStorage && localStorage.getItem('totalEarnings')) {
    totalEarnings = Number(localStorage.getItem('totalEarnings'));
  }

  if (localStorage && localStorage.getItem('spentMoney')) {
    spentMoney = Number(localStorage.getItem('spentMoney'));
  }

  // Check for >1 day count
  if (localStorage && localStorage.getItem('days')) {
    days = Number(localStorage.getItem('days'));
  }

  // Check for nonzero suspicion
  if (localStorage && localStorage.getItem('suspicion')) {
    suspicion = Number(localStorage.getItem('suspicion'));
  }

  document.getElementById('money-won-box').innerHTML = `Money Won: <br> $${(totalEarnings - spentMoney).toFixed(0)}/$10,000,000`;
  document.getElementById('days-left-box').innerHTML = `Days Left: <br> ${days}`;
  document.getElementById('suspicion-box').innerHTML = `Suspicion: <br> ${Math.floor(suspicion)}/100`;

  if (suspicion > 99) {
    const buttons = document.getElementsByClassName('game-button');
    const eodButton = document.getElementById('eod-button');
    const giveUpButton = document.getElementById('give-up-button');

    for (const button of buttons) {
      button.style.setProperty('display', 'none');
    }

    eodButton.style.setProperty('display', 'none');
    
    giveUpButton.style.setProperty('height', '10vh');
    giveUpButton.style.setProperty('width', '10vw');
    giveUpButton.style.setProperty('font-size', 'larger');
  }
}

function toggleGiveUp() {
  const giveUp = document.getElementById('give-up-contain');

  if (giveUp.style.display === "none") {
    giveUp.style.display = "block";
  } else {
    giveUp.style.display = "none";
  }
}

initialize();

const audio = document.getElementById('background-music');
const muteButton = document.getElementById('mute-button');

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

function checkAudio() {
  if (!localStorage.getItem('muted')) {
    localStorage.setItem('muted', 'false');
    audio.muted = false;
    muteButton.src = "Assets/Music/music_muted.png";
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