function initialize() {
  // Default values; if player state hasn't been updated
  let totalEarnings = 0.0;
  let days = 30;
  let suspicion = 0;

  // Check for nonzero earnings value
  if (localStorage && localStorage.getItem('totalEarnings')) {
    totalEarnings = Number(localStorage.getItem('totalEarnings'));
  }

  // Check for >1 day count
  if (localStorage && localStorage.getItem('days')) {
    days = Number(localStorage.getItem('days'));
  }

  // Check for nonzero suspicion
  if (localStorage && localStorage.getItem('suspicion')) {
    suspicion = Number(localStorage.getItem('suspicion'));
  }

  document.getElementById('money-won-box').innerHTML = `Money Won: <br> $${totalEarnings.toFixed(0)}/$10,000,000`;
  document.getElementById('days-left-box').innerHTML = `Days Left: <br> ${days}`;
  document.getElementById('suspicion-box').innerHTML = `Suspicion: <br> ${Math.floor(suspicion)}/100`;
}

initialize();

const audio = document.getElementById('background-music');
const muteButton = document.getElementById('mute-button');

muteButton.addEventListener('click', () => {
  if (audio.muted) {
    audio.muted = false;
    muteButton.src = "Assets/Music/music_playing.png";
  } else {
    audio.muted = true;
    muteButton.src = "Assets/Music/music_muted.png";
  }
});