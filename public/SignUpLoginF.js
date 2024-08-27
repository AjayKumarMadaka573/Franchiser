
function FranchiserSignup(){
    const signupBtn = document.getElementById('Franchiser-signup');

    signupBtn.addEventListener('click',async ()=>{
        const username = document.getElementById('franchiser-signup-name');
        const mail = document.getElementById('franchiser-signup-mail');
        const password = document.getElementById('franchiser-pss');
        const businessType = document.getElementById('franchiser-business-category');
        const NumberOfFranchises = document.getElementById('franchies-number');
        const avgTurnOver = document.getElementById('franchise-average-turnover');
        const hqAddress = document.getElementById('franchise-address');
        const avgStock = document.getElementById('franchise-average-stock');
        const avgPricePerMonth = document.getElementById('franchies-average-month-price');
        const fileInput = document.getElementById('company-logo');
        const file = fileInput.files[0];

        console.log("File "+file);
    if (!file) {
        alert('Please choose a file to upload.');
        return;
    }
        const FranchiserTokens = 100; //100 free per signup
        if(file && username.value && mail.value && password.value && businessType.value && NumberOfFranchises.value && avgTurnOver.value && hqAddress.value && avgStock.value && avgPricePerMonth.value){
        const data = JSON.stringify({
            username:username.value,
            email:mail.value,
            password:password.value,
            businessType:businessType.value,
            numberOfFranchises:NumberOfFranchises.value,
            avgTurnover:avgTurnOver.value,
            hqAddress:hqAddress.value,
            avgStock:avgStock.value,
            avgPricePerMonth:avgPricePerMonth.value,
            franchiserCoins: FranchiserTokens,
            file:file
        });
        let formData = new FormData();
        formData.append('username', username.value);
formData.append('email', mail.value);
formData.append('password', password.value);
formData.append('businessType', 'Food');
formData.append('numberOfFranchises', '1234');
formData.append('avgTurnover', '2345');
formData.append('hqAddress', '9017 Roberts Road');
formData.append('avgStock', '2345');
formData.append('avgPricePerMonth', '2345');
formData.append('franchiserCoins', 100);
formData.append('file', file);
for (let [key, value] of formData.entries()) {
    console.log(key, value);
}
        await sendFranchiserDetails(formData);
    }else{
        alert('Enter all details');
    }
    });
}

FranchiserSignup();


async function sendFranchiserDetails(data){
    const response = await fetch('/api/franchisers/franchiserDetails', {
      method: 'POST',
    
      body:data
  });

  const msg = await response.json();

  console.log(msg);
  if(msg==='Signup Success'){
    //Signup Successful Redirect to Franchiser Page
    window.location.href='/CardF.html';
  }else{
    alert('Signup Fail');
  }

}

//Franchiser Login


function FranchiserLogin(){
    const loginBtn = document.getElementById('Franchiser-login');

    loginBtn.addEventListener('click',async ()=>{
        const username = document.getElementById('franchiser-lname');
        const password = document.getElementById('franchiser-lpss');
        if(username.value && password.value){
            console.log(typeof username.value);
        const data = JSON.stringify({
            username:username.value.toLowerCase(),
            password:password.value
        });
        await validateFranchiserDetails(data);
    }else{
        alert('Enter all details');
    }
    });
}

FranchiserLogin();

async function validateFranchiserDetails(data){
    const response = await fetch('api/franchisers/validateFranchiser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:data
    });

    const msg = await response.json();
    if(msg==='signin success'){
        //Signin Successful Redirect to Delaer Page
        console.log('Login Success');
        window.location.href='/CardF.html';
    }else{
        alert('Invalid Credentials');
    }
}