function visualizeEffect(){
    console.log(data)
    if(data.weaponIDs){
        document.getElementById("effectWeapons").style.display = "block"
        firebase.database().ref("weapons").once('value').then(function(snapshot){
            var weapons = snapshot.val();
            for(var id of data.weaponIDs){
                var weapon = document.createElement("h2")
                var weaponLink = document.createElement("a")
                weaponLink.classList.add("headingText2")
                weaponLink.href = "display.html?contentType=weapon&id=" + id
                weaponLink.innerHTML = weapons[id].name
                weapon.appendChild(weaponLink)
                document.getElementById("effectWeapons").appendChild(weapon)
            }
            document.getElementById("effectLevelSlider").addEventListener("input",effectLevelAdjust)
            document.getElementById("effectLevelValue").addEventListener("input",effectLevelSet)

            adjustEffectStatsForLevel(1)
            document.getElementById("effectTitle").innerHTML = data.name;
            document.getElementById("effectID").innerHTML = data.id;
        })
    } else {
        document.getElementById("effectLevelSlider").addEventListener("input",effectLevelAdjust)
        document.getElementById("effectLevelValue").addEventListener("input",effectLevelSet)

        adjustEffectStatsForLevel(1)
        document.getElementById("effectTitle").innerHTML = data.name;
        document.getElementById("effectID").innerHTML = data.id;
    }
}

function effectLevelAdjust(){
    var level = document.getElementById("effectLevelSlider").value
    document.getElementById("effectLevelValue").value = level
    adjustEffectStatsForLevel(level)
}

function effectLevelSet(){
    var level = document.getElementById("effectLevelValue").value
    if(!isNaN(parseInt(level))){
        level = parseInt(level)
        if(level < 1){
            level = 1
            document.getElementById("effectLevelValue").value = level
        } else if(level > 50){
            level = 50
            document.getElementById("effectLevelValue").value = level
        }
        document.getElementById("effectLevelSlider").value = level;
    }
    adjustEffectStatsForLevel(level)
}

function adjustEffectStatsForLevel(level){
    document.getElementById("effectDescription").innerHTML = createDescription(data,level)
}

