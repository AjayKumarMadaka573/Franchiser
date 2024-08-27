

async function LoadDealers(){
    const dealerContainer = document.getElementById('franchise-dealers');
    const username = getUsername();
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
        html += `<div class="dealer-card">
            <div class="flex justify-center mt-5 h-auto">
                <img class="rounded-full h-[6rem] w-[6rem] border-2 border-gray-900" src="profile_ntr.jpg" alt="">
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

    dealerContainer.innerHTML = html;
}

function getUsername(){
    const profile = document.getElementById('profile-name');
    return profile.textContent;
}

