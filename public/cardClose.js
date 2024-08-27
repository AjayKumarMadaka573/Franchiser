const cardDetails=document.getElementById("card-details");
const closeIcon=document.getElementById("card-close");
closeIcon.addEventListener("click",cardClose);
function cardClose(){
    console.log("kjhgfghjk");
    cardDetails.classList.add('hidden','opacity-0');
    const mains = document.querySelectorAll('main');
    mains.forEach(main=>{
      main.style.opacity='1';
    });
}
