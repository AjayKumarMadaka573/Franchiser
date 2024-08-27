function DealerSignup(){
    const signupBtn = document.getElementById('dealer-signup');

    signupBtn.addEventListener('click',async ()=>{
        const username = document.getElementById('dealer-signup-name');
        const mail = document.getElementById('dealer-signup-mail');
        const password = document.getElementById('dealer-signup-pss');
        const dealerTokens = 100; //100 free per signup
        if(username.value && mail.value && password.value){
        const data = JSON.stringify({
            username:username.value,
            email:mail.value,
            password:password.value,
            dealerCoins: dealerTokens
        });
        const fileInput = document.getElementById('profile-pic');
        const file = fileInput.files[0];

        console.log("File "+file);
    if (!file) {
        alert('Please choose a file to upload.');
        return;
    }
        let formData = new FormData();
        formData.append('username',username.value);
        formData.append('email',mail.value);
        formData.append('password',password.value);
        formData.append('dealerCoins',dealerTokens);
        formData.append('file',file);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        console.log(data);
        await sendDealerDetails(formData);
    }else{
        alert('Enter all details');
    }
    });
}

DealerSignup();

async function sendDealerDetails(data){
    const response = await fetch('/api/dealers/dealerDetails', {
      method: 'POST',
    
      body:data
  });

  const msg = await response.json();

  console.log(msg);
  if(msg==='Signup Success'){
    //Signup Successful Redirect to Dealer Page
    window.location.href='./Assemble.html';
  }else{
    alert('Signup Fail');
  }

}

async function validateDealerDetails(data){
    const response = await fetch('api/dealers/validateDealer', {
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
        window.location.href='./Assemble.html';
    }else{
        alert('Invalid Credentials');
    }
}

function DealerLogin(){
    const loginBtn = document.getElementById('dealer-login');

    loginBtn.addEventListener('click',async ()=>{
        const username = document.getElementById('dealer-name');
        const password = document.getElementById('dealer-pss');
        if(username.value && password.value){
            console.log(typeof username.value);
        const data = JSON.stringify({
            username:username.value.toLowerCase(),
            password:password.value
        });
        await validateDealerDetails(data);
    }else{
        alert('Enter all details');
    }
    });
}

DealerLogin();

