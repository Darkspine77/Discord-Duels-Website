
function weaponLevelAdjust(){
    var level = document.getElementById("weaponLevelSlider").value
    document.getElementById("weaponLevelValue").value = level
    adjustWeaponStatsForLevel(level)
}

function weaponLevelSet(){
    var level = document.getElementById("weaponLevelValue").value
    if(!isNaN(parseInt(level))){
        level = parseInt(level)
        if(level < 1){
            level = 1
            document.getElementById("weaponLevelValue").value = level
        } else if(level > 50){
            level = 50
            document.getElementById("weaponLevelValue").value = level
        }
        document.getElementById("weaponLevelSlider").value = level;
    }
    adjustWeaponStatsForLevel(level)
}

function adjustWeaponStatsForLevel(level){
    document.getElementById("weaponCost").innerHTML = data.goldToUpgrade * level
    document.getElementById("rDamage").innerHTML = findScaledValue(data.moveDamage[0],level)
    document.getElementById("sDamage").innerHTML = findScaledValue(data.moveDamage[1],level)
    document.getElementById("cDamage").innerHTML = findScaledValue(data.moveDamage[2],level)
    if(data.effectIDs){
        document.getElementById("weaponEffects").innerHTML = "<h1 class='headingText'>Effects:</h1>"
        for(var effect of supplementaryData.effects){
            var effectDiv = document.createElement("div")
            
            var effectTitle = document.createElement("h2")
            var effectLink = document.createElement("a")
            effectLink.classList.add("headingText2")
            effectLink.href = "display.html?contentType=effect&id=" + (effect.id - 1)
            effectLink.innerHTML = effect.name
            effectTitle.appendChild(effectLink)
            effectDiv.appendChild(effectTitle)
    
            var effectDescription = document.createElement("p")
            effectDescription.classList.add("contentText")
            effectDescription.innerHTML = createDescription(effect,level)
            effectDiv.appendChild(effectDescription)
    
            document.getElementById("weaponEffects").appendChild(effectDiv)
        }
    }
}

function loadExternalWeaponData(callback){
    if(data.effectIDs){
        firebase.database().ref("effects").once('value').then(function(snapshot){
            supplementaryData.effects = []
            for(var id of data.effectIDs){
                supplementaryData.effects.push(snapshot.val()[id - 1])
            }
            document.getElementById("weaponEffects").style.display = "block";
            if(data.creatureIDs){
                firebase.database().ref("creatures").once('value').then(function(snapshot){
                    supplementaryData.creatures = []
                    for(var id of data.creatureIDs){
                        var creature = snapshot.val()[id - 1]
                        var creatureData = [creature]
                        for(var drop of creature.drops){
                            if(drop.name == data.name){
                                creatureData.push(drop.chance)
                            }
                        }
                        supplementaryData.creatures.push(creatureData)
                    }
                    document.getElementById("weaponLocations").style.display = "block";
                    callback()
                })
            } else {
                callback()
            }
        })
    } else if(data.creatureIDs){
        document.getElementById("weaponLocations").style.gridArea = "effects"
        firebase.database().ref("creatures").once('value').then(function(snapshot){
            supplementaryData.creatures = []
            for(var id of data.creatureIDs){
                var creature = snapshot.val()[id - 1]
                var creatureData = [creature]
                for(var drop of creature.drops){
                    if(drop.name == data.name){
                        creatureData.push(drop.chance)
                    }
                }
                supplementaryData.creatures.push(creatureData)
            }
            document.getElementById("weaponLocations").style.display = "block";
            callback()
        })
    } else {
        document.getElementById("weaponDisplay").style.gridTemplateAreas = '"title title title" "info stats stats" "prev home next"'
        callback()
    }   
}

function visualizeWeapon(){ 
    console.log(data)
    loadExternalWeaponData(function(){
        adjustWeaponStatsForLevel(1)
        document.getElementById("weaponLevelSlider").addEventListener("input",weaponLevelAdjust)
        document.getElementById("weaponLevelValue").addEventListener("input",weaponLevelSet)
        
        document.getElementById("weaponTitle").innerHTML = data.name
        document.getElementById("weaponTier").innerHTML =  data.tier
        document.getElementById("weaponID").innerHTML = data.id  
        document.getElementById("weaponDesc").innerHTML = data.description
        if(data.creatureIDs){
            for(var creature of supplementaryData.creatures){
                console.log(creature)
                var creatureDiv = document.createElement("div")
                creatureDiv.id = "weaponLocation"
                
                var creatureName = document.createElement("h2")
                var creatureLink = document.createElement("a")
                creatureLink.classList.add("headingText2")
                creatureLink.href = "display.html?contentType=creature&id=" + (creature[0].id - 1)
                creatureLink.innerHTML = creature[0].name
                creatureName.appendChild(creatureLink)
                creatureDiv.appendChild(creatureName)
        
                var creatureDescription = document.createElement("p")
                creatureDescription.classList.add("contentText")
                creatureDescription.innerHTML = creature[1] + "% Drop Chance"
                creatureDiv.appendChild(creatureDescription)
        
                document.getElementById("weaponLocations").appendChild(creatureDiv)
            }
        }
    })
} 