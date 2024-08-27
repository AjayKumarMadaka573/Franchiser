// Select the coin and notification elements
const coin = document.querySelector('.coin');
const notification = document.querySelector('.notification');

// Add event listeners for mouse enter and leave
coin.addEventListener('mouseenter', () => {
  notification.classList.add('visible');
});

coin.addEventListener('mouseleave', () => {
  notification.classList.remove('visible');
});
