const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

let flag = 1;

burger.addEventListener('click',()=>{
    if(menu.classList.contains('-translate-x-[100%]')){
        if(flag===1){
       flag=0;
     
        menu.classList.remove('-translate-x-[100%]');
        menu.classList.add('-translate-x-[0%]');
        menu.classList.add('transition-all', 'duration-1000', 'ease-in-out');
        }
    }else{
       
        
      
        menu.classList.remove('-translate-x-[0%]');
        menu.classList.add('-translate-x-[100%]');
        setTimeout(()=>{
            flag=1;
            menu.classList.remove('transition-all', 'duration-1000', 'ease-in-out');
        },1000);
      
    }
});

// Navbar Logics
function hidePagesExcept(pageid){
    const pages = document.querySelectorAll('.Page');
    pages.forEach(page=>{
        if(page.id===pageid){
            if(page.classList.contains('hidden')){
                page.classList.remove('hidden');
            }
         
        }else{
            if(!page.classList.contains('hidden')){
                page.classList.add('hidden');
            }
           
        }
    });
}

function menuClose(){
    menu.classList.remove('-translate-x-[0%]');
    menu.classList.add('-translate-x-[100%]');
    setTimeout(()=>{
        menu.classList.remove('transition-all', 'duration-1000', 'ease-in-out');
        flag=1;
    },1000);
        }

function navBarClickEvents(){
    const navitems = document.querySelectorAll('.nav-item');
    navitems.forEach(nav=>{
        nav.addEventListener('click',(event)=>{
            if(event.target.id==='nav-home'){
                hidePagesExcept('home-page');
               
            }
            if(event.target.id==='nav-view'){
                hidePagesExcept('view-page');
            }
            if(event.target.id==='nav-contact'){
                hidePagesExcept('contact-page');
            }
            if(event.target.id==='nav-about'){
                hidePagesExcept('about-page');
            }
            if(!burger.classList.contains('hidden')){
            menuClose();
            
         
            }
                
                  
                
        });
    });
}

navBarClickEvents();