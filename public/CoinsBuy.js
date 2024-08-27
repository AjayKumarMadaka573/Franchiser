const NoOfCoins = document.getElementById('NoOfCoins');
let NumberOfCoins = 0;
let costofcoin=5;
function increase(){
    NumberOfCoins++;
    NoOfCoins.textContent = NumberOfCoins;
}

function decrease(){
    if(NumberOfCoins>0){
    NumberOfCoins--;
    NoOfCoins.textContent = NumberOfCoins;
    }
}

document.getElementById('buycoins').addEventListener('click',async ()=>{
    let wallet_amount = Number(document.getElementById('wallet-amount').textContent);
    if(NumberOfCoins*costofcoin<=wallet_amount){
        wallet_amount-=NumberOfCoins*costofcoin;
        document.getElementById('wallet-amount').textContent = wallet_amount;
        const username = document.getElementById('profile-name').textContent;

        const data = JSON.stringify({
            username:username,
            amount: -NumberOfCoins*costofcoin
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

        if(result){
            alert("Purchase Successful");

            let dealerCoins = Number(document.getElementById('coins').textContent);

            
      const updated_Coins = dealerCoins+NumberOfCoins;
      const data = JSON.stringify({

        filter:{
          username : username
        },
        update:{
          dealerCoins : updated_Coins
        }
    });
    const response = await fetch('api/dealers/collectApplicationfee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:data
    });
    
    if (!response.ok) {
        throw new Error('Failed to update ');
    }
    
    const result = await response.text();


    console.log(result);

    dealerCoins+=NumberOfCoins;
    UpdateCoins(dealerCoins);
        }
        alert('coins purchase succesful');
    }else{
        alert("Insufficient Funds");
    }
});

function UpdateCoins(coins){
    const coinsEle = document.getElementById('coins');
    coinsEle.textContent = coins;
}