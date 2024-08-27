
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