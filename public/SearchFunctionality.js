const allListings = document.querySelector('.allListings');
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const cards = allListings.querySelectorAll('.card');
  console.log("Exec");
  cards.forEach((card) => {
    const cardTitle = card.querySelector('h1').textContent.toLowerCase();
    const cardHQ = card.querySelector('#hqAddress').textContent.toLowerCase();

    if (cardTitle.includes(searchTerm) || cardHQ.includes(searchTerm)) {
        if(!card.classList.contains('hidden')){
      card.style.display = 'block';
        }
    } else {
      card.style.display = 'none';
    }
  });
});