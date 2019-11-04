var firebaseConfig = {
    apiKey: "AIzaSyCxZM_WAT7tXP4YMGlibZdi-gNKHnhpxhQ",
    authDomain: "discord-duels-data-5cd8f.firebaseapp.com",
    databaseURL: "https://discord-duels-data-5cd8f.firebaseio.com",
    projectId: "discord-duels-data-5cd8f",
    storageBucket: "discord-duels-data-5cd8f.appspot.com",
    messagingSenderId: "850688406556",
    appId: "1:850688406556:web:251ac350e903806de95bd9"
};
firebase.initializeApp(firebaseConfig); 

var urlParams = new URLSearchParams(window.location.search);
var starttype = urlParams.get("type") != undefined ? urlParams.get("type") : "weapons"
var reelCounter = 0;

var glossaryFilters = [
    document.getElementById("weaponFilterSelections"),
    document.getElementById("itemFilterSelections"),
    document.getElementById("creatureFilterSelections"),
    document.getElementById("effectFilterSelections"),
]

var glossaryDivs = [
    document.getElementById("weaponglossdiv"),
    document.getElementById("itemglossdiv"),
    document.getElementById("creatureglossdiv"),
    document.getElementById("effectglossdiv")
]

switch(starttype){
    case "weapons":
        filterWeapons();
        break;
    case "items":
        filterItems();
        break;
    case "creatures":
        filterCreatures();
        break;
    case "effects":
        filterEffects();
        break;
}

function resetDisplay(index){
    for(var element of glossaryFilters){
        element.style.display = "none"
    }
    for(var element of glossaryDivs){
        element.classList.add("hidden")
    }
    glossaryDivs[index].classList.remove("hidden")
    glossaryFilters[index].style.display = "flex"
    document.getElementById("reel").innerHTML = ""
    var offset = document.getElementById("staticHeader").offsetHeight;
    document.getElementById("reel").style.marginTop = offset * 1.1 + "px"
}


document.getElementById("showWeapons").addEventListener("click",function(){
    window.location.search = "?type=weapons"
})
document.getElementById("showItems").addEventListener("click",function(){
    window.location.search = "?type=items"
})
document.getElementById("showCreatures").addEventListener("click",function(){
    window.location.search = "?type=creatures"
})
document.getElementById("showEffects").addEventListener("click",function(){
    window.location.search = "?type=effects"
})

function filterEffects(){
    resetDisplay(3)
    populateItems("effects",{
        modifier:document.getElementById("effectFilterModifier").value,
        status:document.getElementById("effectFilterStatus").value,
        trigger:document.getElementById("effectFilterTrigger").value
    },{normal:document.getElementById("effectSortSelected").value})
}

function populateItems(type,filter,sort){
    reelCounter = 0
    switch(type){
        case "weapons":
            populateWeaponContent(type,filter,sort)
            break
        case "items":
            populateItemContent(type,filter,sort)
            break;
        case "creatures":
            populateCreatureContent(type,filter,sort)
            break;
        case "effects":
            populateEffectContent(type,filter,sort)
            break;
    }
}

function addToReel(element){
    if(reelCounter/25  < 1){
        element.style.animationDelay = reelCounter/25 + "s"   
        reelCounter++  
    } else {
        element.style.animationDelay = "1s"
    }
    
    document.getElementById("reel").appendChild(element)
    
}