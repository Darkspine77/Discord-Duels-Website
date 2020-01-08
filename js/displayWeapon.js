
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



var phdVal = 4952

var tierValues = {
    "1":450,
    "2":900,
    "3":1350,
    "4":1800,
    "5":2250,
    "6":2700,
    "7":3150,
    "8":3600,
    "9":4050,
    "10":4500,
    "rare":2700,
    "faction":3150,
    "boss:":6000,
    "legendary":0,
    "roaming":3600
}

function getWeaponScore(weapon){
    var points = weapon.moveDamage[0][1] + weapon.moveDamage[1][1] + weapon.moveDamage[2][1]
    if(weapon.effects){
        firebase.database().ref("effects").once('value').then(function(snapshot){
            var effectsData = snapshot.val()
            for(var i = 0;i<weapon.effects.length;i++){
                for(var effect of effectsData){
                    if(effect.name == weapon.effects[i]){
                        points += getEffectCost(effect,weapon.tier)
                        break;
                    }
                }
            }
            console.log(points)
        })
    } else {
        console.log(points)
    }
}


function getEffectCost(effect,tier){
    var score = 0;
	if(effect.modifier[0] != 0){
		switch(effect.effectModifier){
			case "damage":
				score += effect.modifier[1] 
				break;
			case "lessdamage":
				score -= effect.modifier[1] * 0.8 
				break;
			case "heal":
				score += effect.modifier[1] * 1.2   
				break;
			case "%damage":
				score += (effect.modifier[0] * phdVal) * 5
				break;
		}
    }
	if(effect.modiferValueEqualsCounters){
		score *= 10
    }
	if(effect.recoil[1] > 0){
		score -= effect.recoil[1]
    }
	if(effect.applyStatus){
		var effectScore = 0
		switch(effect.statusEffect){
			case "wound":
                effectScore += effect.statusStrength[1] * effect.statusDuration
                break;
			case "stun":
                effectScore += tierValues[tier] * effect.statusDuration
                break;
			case "stagger":
                effectScore += (tierValues[tier] * 0.6) * effect.statusDuration
                break;
			case "dizzy":
                effectScore += (effect.statusStrength[0] * (tierValues[tier] * 1.5)) * effect.statusDuration
                break;
			case "invulnerable":
                effectScore -= (tierValues[tier] * 2) * effect.statusDuration
                break;
			case "speAug":
                effectScore -= ((effect.statusStrength[0] - 1) * tierValues[tier]) * effect.statusDuration
                break;
			case "resAug":
                effectScore -= ((effect.statusStrength[0] - 1) * tierValues[tier]) * effect.statusDuration
                break;
			case "strAug":
                effectScore -= ((effect.statusStrength[0] - 1) * tierValues[tier]) * effect.statusDuration
                break;
		}
		if(effect.statusTarget == "self"){
            effectScore = -effectScore
            effectScore += effect.statusDuration * 100
		}
		score += effectScore
    }
	if(effect.clearCounters){
		score -= 100
    }
	if(effect.requiresCounters){
		var count = 0;
		if(!isNaN(effect.requiredCounters)){
			count = effect.requiredCounters
		} else {
			for(var i = 0;i<3;i++){
				if(effect.requiredCounters[i] != -1){
					count += effect.requiredCounters[i]
				}
			}
        }
        if(effect.requiredCounters == 1){
            score /= 5
        } else {
            for(var i = 0;i<count;i++){
                score *= 0.9
            }
        }
		
    }
	if(effect.requiresSuccess != 0){
		score /= 3
    }
	if(effect.chance != 0 && effect.chance != 100){
		score *= effect.chance/100
    }
    score *= effect.effectOnMoves.length
	return Math.ceil(score)
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
            effectLink.href = "display.html?contentType=effect&id=" + (effect.id)
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
                supplementaryData.effects.push(snapshot.val()[id])
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
        getWeaponScore(data)
    })
} 