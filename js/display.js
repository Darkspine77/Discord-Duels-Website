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

var contentData = {
    contentType: urlParams.get("contentType"),
    id: urlParams.get("id")
}

var displayDivs = [
    document.getElementById("weaponDisplay"),
    document.getElementById("itemDisplay"),
    document.getElementById("creatureDisplay"),
    document.getElementById("effectDisplay"),
]

var data;
var supplementaryData = {}

document.getElementById("showWeapons").addEventListener("click",function(){
    window.location ="glossary.html?type=weapons"
})
document.getElementById("showItems").addEventListener("click",function(){
    window.location ="glossary.html?type=items"
})
document.getElementById("showCreatures").addEventListener("click",function(){
    window.location ="glossary.html?type=creatures"
})
document.getElementById("showEffects").addEventListener("click",function(){
    window.location ="glossary.html?type=effects"
})

switch(contentData.contentType){
    case "weapon":
        clearDisplays(0)
        var Data = firebase.database().ref("weapons/" + contentData.id);
        Data.once('value').then(function(snapshot){
            data = snapshot.val();
            visualizeWeapon()
        })
        break;
    case "creature":
        clearDisplays(2)
        var Data = firebase.database().ref("creatures/" + contentData.id);
        Data.once('value').then(function(snapshot){
            data = snapshot.val();
            visualizeCreature()
        })
        break;
    case "item":
        clearDisplays(1)
        var Data = firebase.database().ref("drops/" + contentData.id);
        Data.once('value').then(function(snapshot){
            data = snapshot.val();
            visualizeItem()
        })
        break;
    case "effect":
        clearDisplays(3)
        var Data = firebase.database().ref("effects/" + contentData.id);
        Data.once('value').then(function(snapshot){
            data = snapshot.val();
            visualizeEffect()
        })
        break;
}

function clearDisplays(index){
    for(var display of displayDivs){
        display.style.display = "none"
    }
    displayDivs[index].style.display = "grid"
}


