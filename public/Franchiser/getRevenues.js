let username = "ajay";

let revenuesDateWise = [];
let todaysData = [];
let graphData = [];
let dealers = [];
let franchiserCoins;

window.addEventListener('DOMContentLoaded',async  () => {


    loaderStart();
    fetch('/api/franchisers/franchiserSessionDetails')
  .then(response => response.json())
  .then(async data => {
    console.log('Atleast got a response');
    console.log("UserData "+ data.franchiserCoins);
    if(data.username){
    username = data.username;
    }
    if(data.franchiserCoins){
      franchiserCoins = data.franchiserCoins;
    }
    UpdateProfile(data.username,data.email);
    UpdateCoins(data.franchiserCoins);

     fetchWalletDetails();

     loadImage(data.fileId);
     await getRevenues();
    drawChart(graphData);

    await LoadDealers();

    await LoadApplications();

       
    const dealers_total=document.getElementById('dealers-num');
    const dealers_updated_today=document.getElementById('dealers-updated-today');
    const dealers_pending_today=document.getElementById('dealers-pending-today');

    dealers_total.textContent = dealers.length;
    dealers_updated_today.textContent = todaysData.length;
    dealers_pending_today.textContent = dealers.length - todaysData.length;
  })
  .catch(error => {
    console.error('Error fetching session data:', error);
  });

    
    
});

function updateProfile(){
    const profile = document.getElementById('profile-name');
    profile.textContent = username;
}

async function getRevenues(){

    const data = JSON.stringify({
        franchiserUsername:username
    });
    const response = await fetch('api/dealers/revenue-data', {
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

    let ind = 0;
    for(const each_day of result){
        let l = [];
        for(const revenues of each_day.dealers){
            l.push(revenues.revenue);
            console.log("date "+each_day.date);
            if(isToday(each_day.date)){
                todaysData.push([revenues.dealerUsername,revenues.revenue]);
            }
        }




        revenuesDateWise.push([each_day.date,l]);

        const min = Math.min(...l);
        const max = Math.max(...l);

        const [per25,per75] =  calculatePercentiles(l, [25, 75]);

        let data;
       
        if(ind%2===0){
        data = {
            x : new Date(each_day.date),
            o:per25,
            h:max,
            l:min,
            c:per75
        }
    }else{
        data = {
            x : new Date(each_day.date),
            o:per75,
            h:max,
            l:min,
            c:per25
        }
    }
        graphData.push(data);

        ind++;
    }




    console.log('Graph Data '+graphData);
    getMessages();
    for(const d of graphData){
        console.log(d);
    }
}



function getDaysDifference(givenDate) {
    const today = new Date();
    const diffInMilliseconds = Math.abs(today - new Date(givenDate));
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    return diffInDays;
  }

  function isToday(dateString) {
    // Parse the input date string into a Date object
    const inputDate = new Date(dateString);

    // Get today's date
    const today = new Date();

    // Create dates for comparison by setting time to 00:00:00 to ignore time component
    const inputDateOnly = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Compare the dates
    return inputDateOnly.getTime() === todayDateOnly.getTime();
}


// function to get percentile values
function calculatePercentiles(array, percentiles) {
    array.sort((a, b) => a - b); // Sort the array in ascending order

    function getPercentile(p) {
        if (array.length === 0) return null;
        if (p <= 0) return array[0];
        if (p >= 100) return array[array.length - 1];

        const index = (p / 100) * (array.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;

        return array[lower] * (1 - weight) + array[upper] * weight;
    }

    return percentiles.map(p => getPercentile(p));
}


function drawChart(graph_data){
    Chart.register(Chart.controllers.candlestick);

        const ctx = document.getElementById('candlestickChart').getContext('2d');

        const data = {
            datasets: [{
                label: 'Stock Prices',

                data:graphData,
                // data: [
                //     // { x: new Date('2023-08-14'), o: 100, h: 105, l: 95, c: 102 },
                //     // { x: new Date('2023-08-15'), o: 102, h: 108, l: 100, c: 104 },
                //     // { x: new Date('2023-08-16'), o: 104, h: 110, l: 101, c: 107 },
                //     // { x: new Date('2023-08-17'), o: 107, h: 109, l: 102, c: 103 },
                //     // { x: new Date('2023-08-18'), o: 103, h: 106, l: 98, c: 100 },
                //     // { x: new Date('2023-08-19'), o: 109, h: 107, l: 95, c: 110 },
                //     // { x: new Date('2023-08-20'), o: 104, h: 103, l: 93, c: 123 },
                //     // { x: new Date('2023-08-21'), o: 107, h: 105, l: 96, c: 113 },
                //     // { x: new Date('2023-08-22'), o: 104, h: 107, l: 99, c: 114 },
                //     // { x: new Date('2023-08-23'), o: 100, h: 105, l: 95, c: 102 },
                //     // { x: new Date('2023-08-24'), o: 102, h: 108, l: 100, c: 104 },
                //     // { x: new Date('2023-08-25'), o: 104, h: 110, l: 101, c: 107 },
                //     // { x: new Date('2023-08-26'), o: 107, h: 109, l: 102, c: 103 },
                //     // { x: new Date('2023-08-27'), o: 103, h: 106, l: 98, c: 100 },
                //     // { x: new Date('2023-08-28'), o: 109, h: 107, l: 95, c: 110 },
                //     // { x: new Date('2023-08-29'), o: 104, h: 103, l: 93, c: 123 },
                //     // { x: new Date('2023-08-30'), o: 107, h: 105, l: 96, c: 113 },
                //     // { x: new Date('2023-08-31'), o: 104, h: 107, l: 99, c: 114 },
                //     // { x: new Date('2023-09-01'), o: 102, h: 108, l: 100, c: 104 },
                //     // { x: new Date('2023-09-02'), o: 104, h: 110, l: 101, c: 107 },
                //     // { x: new Date('2023-09-03'), o: 107, h: 109, l: 102, c: 103 },
                //     // { x: new Date('2023-09-04'), o: 103, h: 106, l: 98, c: 100 },
                //     // { x: new Date('2023-09-05'), o: 109, h: 107, l: 95, c: 110 },
                //     // { x: new Date('2023-09-06'), o: 104, h: 103, l: 93, c: 123 },
                //     // { x: new Date('2023-09-07'), o: 107, h: 105, l: 96, c: 113 },
                //     // { x: new Date('2023-09-08'), o: 104, h: 107, l: 99, c: 114 }


                // ],
                color: {
                    up: '#26a69a',
                    down: '#ef5350',
                    unchanged: '#757575'
                },
                barThickness: 10,
                barPercentage: 0.2,
                categoryPercentage: 0.2
            }]
        };

        const config = {
            type: 'candlestick',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: 'transparent'
                        },
                        ticks: {
                            display: true,
                            autoSkip: false
                        }
                    },
                    y: {
                        grid: {
                            display: true,
                            color: 'transparent',
                        },
                        ticks: {
                            display: true
                        }
                    }
                }
            }
        };

        new Chart(ctx, config);
}

// Get Dealer Details



async function LoadDealers(){
    const dealerContainer = document.getElementById('franchise-dealers');
    console.log(username);
    const data = JSON.stringify({
        franchiserUsername:username
    });
    const response = await fetch('api/dealers/FranchiseDealers', {
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

    let html = ``;

    for(const dealer of result){
        dealers.push(dealer);
        let src = getImgSrc(dealer.fileId);
        html += `<div class="dealer-card">
            <div class="flex justify-center mt-5 h-auto">
                <img class="rounded-full h-[6rem] w-[6rem] border-2 border-gray-900" src="${src}" alt="">
            </div>
            <div class="bg-blue-900 h-full mt-[-5%]">
                <h3 class="flex justify-center font-bold text-gray-200 text-xl p-2">
                    Dealer
                </h3>
                <div class="flex justify-center items-center text-xl font-semibold text-gray-300">
                    ${dealer.username}
                </div>
                <div class="flex justify-center items-center text-sm font-semibold text-gray-300 mt-5">
                    <button class="rounded-lg bg-red-600 py-1 px-2" onclick="revokeFranchise('${dealer.username}')">Revoke </button>
                </div>
            </div>
           
        </div>`;
    }

    if(result.length===0){
        html += `<div class="flex justify-center mt-5 w-full col-span-4">
                    <h1 class="mx-auto text-xl text-gray-300">No Dealers to show</h1>
                 </div>`;
    }
    dealerContainer.innerHTML = html;
}

async function LoadApplications(){
    const dealerContainer = document.getElementById('franchise-applications');
    console.log(username);
    const data = JSON.stringify({
        franchiserUsername:username
    });
    const response = await fetch('api/dealers/FranchiseAppliedDealers', {
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

    let html = ``;

    for(const dealer of result){
        let src = getImgSrc(dealer.fileId);
        html += `<div class="flip-card mt-[-10rem] sm:mt-[0rem]">
            <div class="flip-card-inner">
                <div class="flip-card-front rounded-lg flex flex-col items-center bg-opacity-60">
                    <img class="rounded-full h-[6rem] w-[6rem]" src="${src}" alt="">
                    <div class="bg-blue-800 w-full h-full p-2 mt-2 shadow-lg">
                        <p class="text-xl font-semibold">${dealer.username}</p>
                        <p class="text-sm mt-5">Hello I am interested in buying your franchise</p>
                    </div>
                   
                </div>
                <div class="flip-card-back">
                   <div class="flex flex-col justify-around items-center">
                    <div>
                        <button class="bg-green-700 hover:bg-green-900 transition ease-out duration-300 p-2 rounded" onclick="approveApplications('${dealer.username}')">Approve</button>
                    </div>
                    <div class="mt-5">
                        <button class="bg-red-700 hover:bg-red-900 transition ease-out duration-300 p-2 rounded" onclick="rejectApplications('${dealer.username}')">Reject</button>
                    </div>
                   </div>
                </div>
            </div>
        </div>`;
    }
    if(result.length===0){
        html += `<div class="flex justify-center mt-5 w-full col-span-4">
                    <h1 class="mx-auto text-xl text-gray-300">No Applications to show</h1>
                 </div>`;
    }
    dealerContainer.innerHTML = html;
}

function getUsername(){
    const profile = document.getElementById('profile-name');
    return profile.textContent;
}


function getMessages(){
    const messages = document.getElementById('messages');

    let html = ``;

    const today = new Date();

    console.log("Diff "+getDaysDifference(today));
    console.log(todaysData);

    for(const dealer of todaysData){
        html += `<h3>Dealer ${dealer[0]} just updated the revenue - ${dealer[1]}$ </h3>`;
    }

    messages.innerHTML = html;
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


   function fetchWalletDetails(){
    console.log('/api/dealers/franchiserMoney/'+username);
    fetch('/api/franchisers/franchiserMoney/'+username)
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


//Load Profile Image

function loadImage(fileId) {

    if(fileId){
    console.log('fileId' + fileId);
    const imageUrl = `https://franchiser-1.onrender.com/api/franchisers/file/${fileId}`;

    const imgElement = document.getElementById('profile-icon');

    const imgElement2 = document.getElementById('profile');
    imgElement2.src = imageUrl;
    imgElement.src = imageUrl;

    }
}


// Revoke a Franchise
async function revokeFranchise(dealerUsername){

    if(!confirm('Are you sure to revoke')){
        return;
    }
    console.log('Dealer '+dealerUsername);
    const data = JSON.stringify({
        franchiserUsername:username,
        dealerUsername:dealerUsername
    }
    );

    const response = await fetch('api/franchisers/revokeApplication', {
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

    console.log(result);

    if(result==='Revoke Successful'){
        alert('Revoked Successfully');
    }
}

// Approve An Application

async function approveApplications(dealerUsername){
    
    
    if(!confirm('Are you sure to approve')){
        return;
    }
    console.log('Dealer '+dealerUsername);
    const data = JSON.stringify({
        franchiserUsername:username,
        dealerUsername:dealerUsername
    }
    );

    const response = await fetch('api/dealers/approveApplication', {
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

    console.log(result);

    if(result==='Approval Successful'){
        alert('Approved Successfully');
    }
}


//Reject an application

async function rejectApplications(dealerUsername){
    
    
    if(!confirm('Are you sure to Reject')){
        return;
    }
    console.log('Dealer '+dealerUsername);
    const data = JSON.stringify({
        franchiserUsername:username,
        dealerUsername:dealerUsername
    }
    );

    const response = await fetch('api/dealers/RejectApplication', {
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

    console.log(result);

    if(result==='Rejection Successful'){
        alert('Rejectd Successfully');
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