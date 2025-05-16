// audio.js
const bgMusic = new Audio("/assets/audio/tunetank.com_ocean-waves-on-beach.wav");
bgMusic.loop = true;
bgMusic.volume = 0.5;

window.addEventListener("click",()=>{
    bgMusic.play();
})

const volumeRange = document.getElementById("volumeRange");
const muteCheckbox = document.getElementById("muteCheckbox");

volumeRange.addEventListener("input", () => {
  bgMusic.volume = volumeRange.value / 100;
});

muteCheckbox.addEventListener("change", () => {
  bgMusic.muted = muteCheckbox.checked;
});
