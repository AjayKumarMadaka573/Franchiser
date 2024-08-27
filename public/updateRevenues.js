const carouselContainer = document.querySelector('.carousel-container');
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    const itemsToShow = ()=> {
        const windowWidth = window.innerWidth;
        console.log(windowWidth);
        if (windowWidth < 1000) { // Adjust breakpoint as needed
          return 1; // 100% width for small screens
        } else {
          return 3; // Adjust this based on desired items per screen (100% / number of items)
        }
      };
    const itemWidth = () => {
        const windowWidth = window.innerWidth;
        console.log(windowWidth);
        if (windowWidth < 1000) { // Adjust breakpoint as needed
          return 20.3; // 100% width for small screens
        } else {
          return 34.833333; // Adjust this based on desired items per screen (100% / number of items)
        }
      };
    const totalItems = carouselItems.length;
    const totalPages = Math.ceil(totalItems / itemsToShow());
    
    let currentIndex = 0;

    function updateTransform() {
      const translateXValue = -currentIndex * itemWidth() * itemsToShow();
      carouselContainer.style.transform = `translateX(${translateXValue}%)`;
    }

    function showPrev() {
      if (currentIndex > 0) {
        currentIndex--;
        updateTransform();
      }
    }

    function showNext() {
      if (currentIndex < totalPages - 1) {
        currentIndex++;
        updateTransform();
      }
    }

    // Initialize carousel position
    updateTransform();

let franchiser;
let revenue;
let user;

//  Form to Update Revenue
function updateFormLoad(btn){
 franchiser = btn.dataset.franchiser;
 revenue = Number(btn.dataset.revenue);
 user = btn.dataset.user;

  const submit = document.getElementById('submit-update');

  submit.addEventListener('click',async ()=>{
    console.log("revenue "+revenue);
    const rupdate = document.getElementById('daily-turnover');
    const data = JSON.stringify({
      filter:{
        franchiserUsername:franchiser,
        dealerUsername:user
      },
      update:{
        revenue:revenue + Number(rupdate.value)
      }
    });
    const response = await fetch('api/dealers/updateRevenue', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body:data
  });
  
  if (!response.ok) {
      throw new Error('Failed to apply');
  }
  
  const result = await response.json();

  console.log(result);

  alert("Update Successful");

  updateBadge(franchiser);
  updateFormClose();
  });

  function updateBadge(id){
    const ele = document.getElementById('f-'+id);
    console.log("Executing "+ele.textContent);
    ele.classList.remove('text-red-700');
    ele.classList.add('text-green-700');
    ele.textContent = "Updated";
    const ele2 = document.getElementById('u-'+id);
    ele2.innerHTML = `<div class="text-green-700 scale-125"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
</svg>

</div>`;
  }

  console.log(franchiser,revenue);
  const updateForm = document.getElementById('update-form');
  const franchiseCards = document.getElementById('franchise-cards');


   updateForm.classList.remove('opacity-0');
   updateForm.classList.add('opacity-100');
   franchiseCards.classList.add('opacity-10');
  
 
   updateForm.classList.add('transition-opacity', 'duration-500', 'ease-in-out');
   franchiseCards.classList.add('transition-opacity', 'duration-500', 'ease-in-out');

}

function updateFormClose(){
  const updateForm = document.getElementById('update-form');
  const franchiseCards = document.getElementById('franchise-cards');
  updateForm.classList.remove('opacity-100');
  updateForm.classList.add('opacity-0');
  franchiseCards.classList.remove('opacity-10');

}


