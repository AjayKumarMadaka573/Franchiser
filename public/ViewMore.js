const AllListings = document.querySelector('.allListings');

function hideExtraListings(){
    const cards = AllListings.querySelectorAll('.card');
    for(let i=12;i<cards.length;i++){
        cards[i].classList.add('hidden');
    }
}

hideExtraListings();

function ViewMore(btn){
    btn = btn.querySelector('.view-container').querySelector('.view-text');
    if(btn.textContent==='View More'){
    const cards = AllListings.querySelectorAll('.card');
    let l = 0;
    for(let i=0;i<cards.length;i++){
        if(!cards[i].classList.contains('hidden')){
            l++;
        }
    }

    let ll;
    if(l+12<cards.length){
        ll=l+12;
    }else{
        ll=cards.length;
        btn.textContent = "View Less";
    }
    for(let i=l;i<ll;i++){
        cards[i].classList.remove('hidden');
    }
}else{
    ViewLess(btn);
}
}

function ViewLess(btn){
    const cards = AllListings.querySelectorAll('.card');
    let l = 0;
    for(let i=0;i<cards.length;i++){
        if(cards[i].classList.contains('hidden')){
            l++;
        }
    }
    if(cards.length>13){
    l = l%6 + 6;
    }else{
        l= l%6;
    }
    for(let i=cards.length-1;i>=cards.length-1-l;i--){
        cards[i].classList.add('hidden');
    }
    btn.textContent="View More";
}

function viewForm(){
    const cards = AllListings.querySelectorAll('.card');
    const form = document.getElementById('franchise-form');
    for(let i=0;i<cards.length;i++){
        cards[i].addEventListener('click',(event)=>{
            form.classList.remove('hidden');

            document.querySelectorAll('.Trigger-form').forEach(element => {
                if(!element.classList.contains('hidden') && element.id!=='franchise-form'){
                    element.classList.add('hidden');
                }
            });
        });
    }
}

function Close(close_icon_id,container_id){
    const element = document.getElementById(close_icon_id);
    element.addEventListener('click',()=>{
        document.querySelectorAll('.Trigger-form').forEach(element => {
            console.log(element.id);
            if(element.classList.contains('hidden') && element.id!==container_id){
                element.classList.remove('hidden');
            }
            if(element.id===container_id){
                element.classList.add('hidden');
                console.log("Executing");
            }
        });
    });
}

viewForm();
Close('popup-close','franchise-form');

// Profile Popup Logic
const profile = document.getElementById('profile');
function showProfile(){
    profile.addEventListener('click',()=>{
        const profile_container=document.querySelector('.profile-container');
        if(profile_container.classList.contains('hidden')){
            profile_container.classList.remove('hidden');
        }
    });
}

showProfile();

function closeProfile(){
    const profile_close = document.getElementById('profile-close');
    profile_close.addEventListener('click',()=>{
        const profile_container=document.querySelector('.profile-container');
        profile_container.classList.add('hidden');
    });
}

closeProfile();

const parentContainer = document.querySelector('#profile-con');

  parentContainer.addEventListener('click', (event) => {
    console.log(event.target);
    if (event.target.id === 'profile-close' || event.target.id === 'profile-close-2') {
      event.stopPropagation();
      console.log('Profile close clicked!');
      const profile_container=document.querySelector('.profile-container');
        profile_container.classList.add('hidden');
    }
  });