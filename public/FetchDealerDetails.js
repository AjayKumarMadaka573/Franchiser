let username="No User";
let dealerCoins = 0;

const myList = [ 'B.jpg', 'C.jpg', 'E.jpg','F.png','I.webp','J.jpg','K.png','L.png','M.png','N.jpg','O.jpg','P.jpg','Q.avif'];

window.addEventListener('DOMContentLoaded',async  () => {

  loaderStart();
    fetch('/api/dealers/dealerSessionDetails')
  .then(response => response.json())
  .then(async data => {
    console.log('Atleast got a response');
    console.log("UserData "+ data.dealerCoins);
    if(data.username){
    username = data.username;
    }
    if(data.dealerCoins){
      dealerCoins = data.dealerCoins;
    }
    UpdateProfile(data.username,data.email);
    UpdateCoins(data.dealerCoins);

    
    loadImage(data.fileId);
     await LoadApprovedFranchises();
     await LoadNotApprovedFranchises();

     await getRejectedApplications();
     fetchWalletDetails();
  })
  .catch(error => {
    console.error('Error fetching session data:', error);
  });



});

function fetchWalletDetails(){
  console.log('/api/dealers/dealerMoney/'+username);
  fetch('/api/dealers/dealerMoney/'+username)
  .then(response => response.json())
  .then(async data => {
    console.log('Atleast got a response 2');
    console.log(username+data);
    document.getElementById('wallet-amount').textContent = data;
  })
  .catch(error => {
    console.error('Error fetching account data:', error);
  });

  loaderStop();
}

async function updateWallet(money){
  const data = JSON.stringify({
    username:username,
    amount:money
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

}


async function updatefranchiserWallet(username,money){
  const data = JSON.stringify({
    username:username,
    amount:money
});

const response = await fetch('api/franchisers/updateWalletMoney', {
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

}

function UpdateCoins(coins){
    const coinsEle = document.getElementById('coins');
    coinsEle.textContent = coins;
}

function UpdateProfile(uname,umail){
    const name = document.getElementById('profile-name');
    const mail = document.getElementById('profile-mail');

    name.textContent = uname;
    mail.textContent = umail;
}


// Franchiser Fetch Section

function FetchFranchisersDetails(){
  fetch('/api/franchisers/franchiserDetails')
  .then(response => response.json())
  .then(async data => {
    console.log('Fracnhiser Details Response');
    console.log(data);


    UpdateFranchisersAllList(data);
   
  })
  .catch(error => {
    console.error('Error fetching session data:', error);
  });
}

FetchFranchisersDetails();
function FetchMostPopularFranchisersDetails(){
  fetch('/api/franchisers/mostPopularFranchisers')
  .then(response => response.json())
  .then(async data => {
    console.log('Most Popular Franchiser Details Response');
    console.log(data);


    UpdateMostPopularFranchisersList(data);
   
  })
  .catch(error => {
    console.error('Error fetching session data:', error);
  });
}

FetchMostPopularFranchisersDetails();

function viewForm(){
  const AllListings = document.querySelector('.allListings');
  console.log("View Executing");
 const form = document.getElementById('franchise-form');
          form.classList.remove('hidden');

          document.querySelectorAll('.Trigger-form').forEach(element => {
              if(!element.classList.contains('hidden') && element.id!=='franchise-form'){
                  element.classList.add('hidden');
              }
          });



         
          close_alternate();
  }


//To get random image
function getRandomElement(list) {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}
let MostPopularListFranchises = [];
function UpdateMostPopularFranchisersList(data){
  const container = document.getElementById('most-popular-franchiser-list');
  container.textContent = '';
  
  html = ``;
  let i=0;
  for(const franchiser of data){

      MostPopularListFranchises.push(franchiser);

      html += `<div class="card flex flex-col  justify-center items-center col-span-1" value="${i}" onclick="LoadApplyPage2(this)">
            <div class="mt-5">
                <img class="h-[7rem] shadow-lg rounded-full"`
                let src = getImgSrc(franchiser.fileId);
                html+= ` src="${src}" alt="">
            </div>
            <div class="p-2">
                <h2 class="text-gray-400 font-semibold">${franchiser.username}</h2>
            </div>
        </div>`;
  //     html += `<div class="card" value="${i}" onclick="LoadApplyPage2(this)">
  //     <div>
  //         <img class="card-img" src="${getRandomElement(myList)}" alt="">
  //     </div>
  //     <div class="text-gray-300 flex flex-col items-center p-2 h-7rem">
  //         <div class="mb-2">
  //             <h1 class="font-bold text-xl">${franchiser.username}</h1>
  //         </div>
  //         <div class="flex font-semibold">
  //             <h3>Franchises Available: </h3><span id="noOfFranchises">${franchiser.numberOfFranchises }</span>
  //         </div>
  //         <div class="font-semibold mb-2">
  //             HQ : <span id="hqAddress">${franchiser.hqAddress}</span>
  //         </div>
  //         <div>
  //             <button class="rounded bg-gray-800 transition ease-out duration-300 hover:bg-gray-900 px-4 py-2 text-xs" id="${franchiser.username}">Get Franchise</button>
  //         </div>
  //     </div>
  // </div>`;
  i++;
  }

  container.innerHTML = html;

}
let AllListFranchises = [];

function UpdateFranchisersAllList(data){
  const container = document.getElementById('franchisers-all-list');
  container.textContent = '';
  


  html = ``;
  let ind =0;
  for(const franchiser of data){
      const f_json = JSON.stringify(data);
      AllListFranchises.push(franchiser);


      html += `<div class="card flex flex-col  justify-center items-center col-span-1" value="${ind}" onclick="LoadApplyPage(this)">
            <div class="mt-5">
                <img class="h-[7rem] shadow-lg rounded-full"`;
                 let src = getImgSrc(franchiser.fileId);
                  html+=` src="${src}" alt="">
            </div>
            <div class="p-2">
                <h2 class="text-gray-400 font-semibold">${franchiser.username}</h2>
            </div>
        </div>`;
      // html += `<div class="card"  value="${ind}" data-franchiser="${f_json}" onclick="LoadApplyPage(this)">
      //             <div>
      //                 <img class="card-img" src="${getRandomElement(myList)}" alt="">
      //             </div>
      //             <div class="text-gray-300 flex flex-col items-center p-2 h-7rem">
      //                 <div class="mb-2">
      //                     <h1 class="font-bold text-xl">${franchiser.username}</h1>
      //                 </div>
      //                 <div class="flex font-semibold">
      //                     <h3>Franchises Available: </h3><span id="noOfFranchises">${franchiser.numberOfFranchises }</span>
      //                 </div>
      //                 <div class="font-semibold mb-2">
      //                     HQ : <span id="hqAddress">${franchiser.hqAddress}</span>
      //                 </div>
      //                 <div>
      //                     <button class="rounded bg-gray-800 transition ease-out duration-300 hover:bg-gray-900 px-4 py-2 text-xs" value="${ind}" id="${franchiser.username}" >Get Franchise</button>
      //                 </div>
      //             </div>
      //         </div>`;
              ind++;
  }

  container.innerHTML = html;

}






function Close(close_icon_id,container_id){
  const element = document.getElementById(close_icon_id);
  console.log(element);
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



function LoadApplyPage(btn){
  const value = btn.getAttribute('value');
  const franchiser_data = AllListFranchises[Number(value)];
  console.log(value);
  const container = document.getElementById('franchise-form');
  
  console.log("Executing");
 let html= ` <div class="pop-up-container">
              <div class="pop-up-header">
                  <h1 class="font-bold text-3xl m-2">${franchiser_data.username}</h1>
              </div>
              <div>
                  <img class="circle"`;
                   let src = getImgSrc(franchiser_data.fileId);
                  html+=` src="${src}" alt="">
              </div>
              <div class="pop-up-description-container">
                  <p class="pop-up-description-text">
                     ${franchiser_data.hqAddress}
                  </p>
              </div>
              <div class="pop-up-costs">
                  <div class="font-semibold">
                      <h3>TurnOver: ${franchiser_data.avgTurnover} $</h3>
                  </div>
                  <div class="font-semibold">
                      <h3>Monthly Cost: <span>${franchiser_data.avgStock}$</span></h3>
                  </div>
              </div>
              <div class="cursor-pointer">
                  <button class="apply-btn"data-franchiser='${JSON.stringify(franchiser_data)}' onclick="apply(this)">Apply</button>
              </div>
              <div class="absolute top-5 right-5 transform scale-[150%] cursor-pointer" id="popup-close" onclick='close_alternate()'>
                  <svg id="popup-close1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path id="popup-close2" stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
              </div>
           

          </div>
      `;
      container.innerHTML = html;
      viewForm();
}

function LoadApplyPage2(btn){
  const value = btn.getAttribute('value');
  const franchiser_data = MostPopularListFranchises[Number(value)];
  console.log(franchiser_data);
  const container = document.getElementById('franchise-form');
  
  // viewForm();
  let html = ``;
 html = ` <div class="pop-up-container">
              <div class="pop-up-header">
                  <h1 class="font-bold text-3xl m-2">${franchiser_data.username}</h1>
              </div>
              <div>
                  <img class="circle"`;
                  let src = getImgSrc(franchiser_data.fileId);
                  html+=` src="${src}" alt="">
              </div>
              <div class="pop-up-description-container">
                  <p class="pop-up-description-text">
                     ${franchiser_data.hqAddress}
                  </p>
              </div>
              <div class="pop-up-costs">
                  <div class="font-semibold">
                      <h3>TurnOver: ${franchiser_data.avgTurnover} $</h3>
                  </div>
                  <div class="font-semibold">
                      <h3>Monthly Cost: <span>${franchiser_data.avgStock}$</span></h3>
                  </div>
              </div>
              <div class="cursor-pointer">
                  <button class="apply-btn" data-franchiser='${JSON.stringify(franchiser_data)}' onclick="apply(this)">Apply</button>
              </div>
              <div class="absolute top-5 right-5 transform scale-[150%] cursor-pointer" id="popup-close" onclick='close_alternate()'>
                  <svg id="popup-close1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path id="popup-close2" stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
              </div>
           

          </div>
      `;

      container.innerHTML = html
      console.log("Done");
      const AllListings = document.querySelector('.allListings');
  console.log("View Executing");
 const form = document.getElementById('franchise-form');

 console.log(form);
          
          
          document.querySelectorAll('.Trigger-form').forEach(element => {
              console.log(element);
            
                  element.classList.add('hidden');
              
          });
          form.classList.remove('hidden');


     
}
function close_alternate(){
  const container = document.getElementById('franchise-form');

  document.querySelectorAll('.Trigger-form').forEach(element => {
      console.log(element.id);
      if(element.classList.contains('hidden')){
          element.classList.remove('hidden');
      }
  });
  console.log("Not ");
  container.classList.add('hidden');
}


        
async function apply(btn){

  console.log(typeof dealerCoins);
  if(dealerCoins>=20){
  const franchiserData = JSON.parse(btn.getAttribute('data-franchiser'));
  
  let id = franchiserData.username;
  if(confirm('Are you sure to apply? 20 Dealer coins will be charged')){
   
  console.log("Username "+username);
  const data = JSON.stringify({
      franchiserUsername:id,
      dealerUsername:username,
      approved:0
  });
  const response = await fetch('api/dealers/franchiseApplication', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body:data
  });
  
  if (!response.ok) {
      throw new Error('Failed to apply');
  }
  
  const result = await response.text();
  
  console.log(result);
  
  if(result==='"Application Successfully Submitted"'){
alert('Application Successfully Submitted');
      const container = document.getElementById('franchise-form');

      document.querySelectorAll('.Trigger-form').forEach(element => {
          console.log(element.id);
          if(element.classList.contains('hidden')){
              element.classList.remove('hidden');
          }
      });
      console.log("Not ");
      container.classList.add('hidden');
      dealerCoins = Number(document.getElementById('coins').textContent);
      const updated_Coins = dealerCoins-20;
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

    dealerCoins-=20;
    UpdateCoins(dealerCoins);
    
  }
  
  
  }
}else{
  alert('Insufficient Coins..Recharge Now');
}
  
  }



//Load Your Franchises Sections


function getDaysDifference(givenDate) {
  const today = new Date();
  const diffInMilliseconds = Math.abs(today - new Date(givenDate));
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return diffInDays;
}

async function LoadApprovedFranchises(){

  const data = JSON.stringify({
      username:username
  });



  const response = await fetch('api/dealers/getApprovedFranchises', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body:data
  });
  
  if (!response.ok) {
      throw new Error('Failed to update ');
  }
  
  const result = await response.json();

  console.log(result);

  
  html = ``;
  let ind = 0;

  for(const application of result){
    const franchise = application.franchiser;

   

    // Check if already updated
    const data = JSON.stringify({
      dealerUsername:username,
      franchiserUsername:franchise.username
    });
    const response = await fetch('api/dealers/checkIfUpdatedToday', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body:data
  });
  
  if (!response.ok) {
      throw new Error('Failed to check ');
  }
  

  const msg = await response.json();

  console.log(msg);

  let colors = ['orange','blue','pink'];

  for(const appn of application.applications){


     //If a month is over collect revenue
     if(getDaysDifference( appn.startDate)%30===0 && getDaysDifference(appn.startDate)!==0){
      await updateWallet(-franchise.avgPricePerMonth);
      await updatefranchiserWallet(franchise.username,franchise.avgPricePerMonth);
    };


    html += `<div class="carousel-item `
    
    if(ind===0){
      html += ` ml-[21.3%] sm:ml-[0%] `;
    }
    
    html += ` flex w-full h-64 duration-100 sm:duration-500">
                <div class="bg-gray-900 -translate-x-[0%] rounded-lg h-[26rem] w-[17rem] overflow-hidden transform  transform  cursor-pointer  transform hover:scale-[106%] transition ease-out duration-100 franchise-list-item">
                <div>
                    <img class="w-[17rem] h-[12rem]"`;
                    let src = getImgSrc(franchise.fileId);
                html+= ` src="${src}" alt="">
                </div>
                <div class="h-[10rem]">
                    <div class="flex justify-center p-2">
                        <h1 class="font-bold text-xl text-gray-900">${franchise.username}</h1>
                    </div>
                    <div class="p-2 px-4 flex flex-col justify-center items-center text-xl">
                    <h1 class="font-semibold text-gray-300">HQ Address</h1>
                        <p class="text-sm text-gray-400">${franchise.hqAddress}</p>
                    </div>
                </div>
                <div class="px-2 flex justify-center bg-${colors[ind%3]}-600 h-[4rem]">
                    <div class="border-r-[0.1rem] border-gray-700 w-[33%] flex flex-col items-center justify-center">
                        <div>
                            <h3 class="font-semibold text-gray-200 text-2xl">${getDaysDifference( appn.startDate)}</h3>
                        </div>
                        <div>
                            <h5 class="text-gray-300 text-lg">days</h5>
                        </div>
                    </div>
                    <div class="border-r-[0.1rem] border-gray-700 w-[33%] flex flex-col items-center justify-center">
                        <div>
                            <h3 class="font-semibold text-gray-200 text-xl">${appn.revenue}$</h3>
                        </div>
                        
                        <div>
                            <h5 class="text-gray-300 text-lg">Revenue</h5>
                        </div>
                    </div>
                    <div class="w-[33%] flex flex-col items-center justify-center" id="u-${franchise.username}">
                        `;
                        
                    if(msg==='Not Updated'){
                    html+=
                        `
                        <button class="text-gray-800 p-3 bg-gray-300 rounded-lg font-semibold text-xs" data-franchiser="${franchise.username}" data-revenue="${appn.revenue}" data-user="${appn.dealerUsername}" onclick="updateFormLoad(this)">Update</button>
                    `
                    }else{
                      html+=`<div class="text-gray-900 scale-125"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
</svg>

</div>`;
                    }
                    html +=`    </div>
                    
                </div>
                <div class="badge">
                    <div>
                        <h3 class="text-gray-700">Status: `;
                        
                        if(msg==='Not Updated'){
                      html+=`<span class="text-red-700"  id="f-${franchise.username}">Not Updated</span></h3>`;
                        }else{
                          html+=`<span class="text-green-700"  id="f-${franchise.username}">Updated</span></h3>`;
                        }
                    html += `</div>
                </div>
            </div>
             </div>`;

             ind++;
  }
}


  const container = document.getElementById('approved-franchises');

  container.innerHTML = html;

}


async function LoadNotApprovedFranchises(){

  const data = JSON.stringify({
      username:username
  });



  const response = await fetch('api/dealers/getNotApprovedFranchises', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body:data
  });
  
  if (!response.ok) {
      throw new Error('Failed to update ');
  }
  
  const result = await response.json();

  console.log(result);

  
  html = ``;
  let ind = 0;

  const container = document.getElementById('pending-cards');
  for(const application of result){
    const franchise = application.franchiser;

    for(const appn of application.applications){
      html +=   `<div class="card flex flex-col h-[8rem] -mb-[20rem] -translate-x-[1rem] justify-center items-center col-span-1">
            <div class="mt-0">
                <img class="h-[7rem] w-[7rem] shadow-lg rounded-full"`;
                
                let src = getImgSrc(franchise.fileId);
                html+= ` src="${src}" alt="">
            </div>
            <div class="p-2">
                <h2 class="text-gray-300 font-semibold">${franchise.username}</h2>
            </div>
        </div>`;
    }

  }

  container.innerHTML = html;
}



function loaderStart(){
  console.log("Loader Started");
  const loader = document.getElementById('loader');
  loader.classList.remove('opacity-0');
  loader.classList.add('opacity-100');
  const mains = document.querySelectorAll('main');
  mains.forEach(main=>{
    main.style.opacity='0.1';
  });
}

function loaderStop(){
  console.log("Loader Stopped");
  const loader = document.getElementById('loader');
  loader.classList.remove('opacity-100');
  loader.classList.add('opacity-0');
  const mains = document.querySelectorAll('main');
  mains.forEach(main=>{
    main.style.opacity='1';
  });
 }

// Get Rejected Applications

async function getRejectedApplications(){
  const response = await fetch('/api/dealers/rejectedApplications/'+username);

  const ele =  document.getElementById('messages');
  const msgs = await response.json();

  let html = ``;
  let ind = 0;
  for(const msg of msgs){
    html += `<p>${msg.franchiserUsername} has rejected your application</p>`;
  }

  if(msgs.length===0){
    html += '<p class="ml-[25%] mt-[10%]">No Messages to show</p>';

  }

  ele.innerHTML = html;
}


//Load Profile Image

function loadImage(fileId) {

  if(fileId){
  console.log('fileId' + fileId);
  const imageUrl = `https://franchiser-1.onrender.com/api/franchisers/file/${fileId}`;

  const imgElement = document.getElementById('profile');

  const imgElement2 = document.getElementById('profile-icon');
  imgElement2.src = imageUrl;
  imgElement.src = imageUrl;

  }
}

function getImgSrc(fileId){
  
  if(fileId){
    console.log('fileId' + fileId);
    const imageUrl = `https://franchiser-1.onrender.com/api/franchisers/file/${fileId}`;

    return imageUrl;
  }

  return getRandomElement(myList);
}