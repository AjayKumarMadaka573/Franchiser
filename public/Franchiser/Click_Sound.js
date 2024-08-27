// Get the sound element
const clickSound = document.getElementById('click-sound');

// Attach event listener to all buttons
document.querySelectorAll('.click-sound').forEach(button => {
    button.addEventListener('click', () => {
        clickSound.currentTime = 0;  // Rewind to the start
        clickSound.play();
    });
});
