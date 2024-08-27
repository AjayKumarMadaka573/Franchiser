
window.addEventListener('DOMContentLoaded',async  () => {

const messageIcon = document.getElementById('message-icon');
const messageIcon2 = document.getElementById('message-icon2');
const messagesContainer = document.getElementById('messages-container');
messageIcon.addEventListener('mouseenter', function () {

    console.log("Hovered");
    messagesContainer.classList.remove('hidden');
 
    messagesContainer.classList.add('visible');
   
        
  
});

messageIcon2.addEventListener('mouseenter', function () {

    console.log("Hovered");
    messagesContainer.classList.remove('hidden');
 
    messagesContainer.classList.add('visible');
   
        
  
});

messageIcon.addEventListener('mouseleave', function () {
    setTimeout(function() {
        if (!messagesContainer.matches(':hover')) {
            messagesContainer.classList.remove('visible');

            setTimeout(function() {
                messagesContainer.classList.add('hidden');
            },300);
        }
    }, 100);
});


messageIcon2.addEventListener('mouseleave', function () {
    setTimeout(function() {
        if (!messagesContainer.matches(':hover')) {
            messagesContainer.classList.remove('visible');

            setTimeout(function() {
                messagesContainer.classList.add('hidden');
            },300);
        }
    }, 100);
});

messagesContainer.addEventListener('mouseleave', function () {
    messagesContainer.classList.remove('visible');
    setTimeout(function() {
        messagesContainer.classList.add('hidden');
    },300);
});

});