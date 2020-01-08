function creatureLevelAdjust(){
    var level = document.getElementById("creatureLevelSlider").value
    document.getElementById("creatureLevelValue").value = level
    adjustCreatureStatsForLevel(level)
}

function creatureLevelSet(){
    var level = document.getElementById("creatureLevelValue").value
    if(!isNaN(parseInt(level))){
        level = parseInt(level)
        if(level < 1){
            level = 1
            document.getElementById("creatureLevelValue").value = level
        } else if(level > 50){
            level = 50
            document.getElementById("creatureLevelValue").value = level
        }
        document.getElementById("creatureLevelSlider").value = level;
    }
    adjustCreatureStatsForLevel(level)
}

function adjustCreatureStatsForLevel(level){
    document.getElementById("creatureHealth").innerHTML = Math.ceil(data.base_health * (supplementaryData.healthMod * level))
}

function loadExternalCreatureData(callback){
    firebase.database().ref("statistics/enemy_base_health_multiplier").once('value').then(function(snapshot){
        supplementaryData.healthMod = snapshot.val()
        callback()
    })
}
function visualizeCreature(){
    loadExternalCreatureData(function(){
        adjustCreatureStatsForLevel(1)
        document.getElementById("creatureLevelSlider").addEventListener("input",creatureLevelAdjust)
        document.getElementById("creatureLevelValue").addEventListener("input",creatureLevelSet)

        document.getElementById("creatureTitle").innerHTML = data.name
        document.getElementById("creatureTier").innerHTML = data.tier
        document.getElementById("creatureID").innerHTML = data.id
        document.getElementById("creatureWeapon").innerHTML = data.weapon.name
        if(data.drops){
            data.drops.sort(function(a,b){
                if(a.chance > b.chance){
                    return -1
                } else if(a.chance < b.chance){
                    return 1
                }
                return 0
            })
            for(var drop of data.drops){
                var dropDiv = document.createElement("div")
                
                var dropelement = document.createElement("h2")
                if(drop.id){
                    var droplink = document.createElement("a")
                    if(drop.level){
                        droplink.href = "display.html?contentType=weapon&id=" + (drop.id)
                    } else {
                        droplink.href = "display.html?contentType=item&id=" + (drop.id - 1)
                    }
                    droplink.classList.add("headingText2")
                    droplink.innerHTML = drop.name
                    dropelement.appendChild(droplink)
                } else {
                    if(drop.name != "nothing"){
                        dropelement.innerHTML = drop.name + ": " + drop.chance + "%"
                    } else {
                        dropelement.innerHTML = "Nothing: " + parseFloat(drop.chance).toPrecision(2) + "%"
                    }
                    dropelement.classList.add("headingText2")
                }
                dropDiv.appendChild(dropelement)

                var dropDescription = document.createElement("p")
                dropDescription.classList.add("contentText")
                dropDescription.innerHTML = parseFloat(drop.chance).toPrecision(2) + "% Chance"
                dropDiv.appendChild(dropDescription)
        
                document.getElementById("creatureDrops").appendChild(dropDiv)
            }
        }
    })
}
