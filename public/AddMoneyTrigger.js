const ele = document.getElementById('add-money-trigger');

ele.addEventListener('click',()=>{
    addMoneyStart();
});

function addMoneyStart(){
    console.log("card Details Section Started");
    const cardDetailsCard = document.getElementById('card-details');
    cardDetailsCard.classList.remove('opacity-0');
    cardDetailsCard.classList.remove('hidden');
    cardDetailsCard.classList.add('opacity-100');
    const mains = document.querySelectorAll('main');
    mains.forEach(main=>{
      main.style.opacity='0.1';
    });
  }

  
function addMoneyStop(){
    console.log("card Details Section Stopped");
    const cardDetailsCard = document.getElementById('card-details');
    cardDetailsCard.classList.add('opacity-0');
    cardDetailsCard.classList.add('hidden');
    cardDetailsCard.classList.remove('opacity-100');
    const mains = document.querySelectorAll('main');
    mains.forEach(main=>{
      main.style.opacity='1';
    });
  }

const cadd = document.getElementById('c-add');

cadd.addEventListener('click',async ()=>{
    const cname = document.getElementById('c-name');
    const cnumber = document.getElementById('c-number');

    if(cname.value!=='' && cnumber.value!==''){
        const username = document.getElementById('profile-name').textContent;
        const ccash = document.getElementById('c-cash');
        const cash = Number(ccash.value);
        console.log(cash+"Check Cash");
        const data = JSON.stringify({
            username:username,
            amount: cash
        });
        const response = await fetch('api/dealers/updateWalletMoney', {
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

        console.log(result+"Yes");
        if(result){
            alert("Money Added Succesfully");
            addMoneyStop();
            document.getElementById('wallet-amount').textContent = result.money;
        }
    }else{
        alert("Invalid Details");
    }
});