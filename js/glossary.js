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

function findScaledValue(minMax,level,multi){
	if(multi == undefined){
		multi = 1
	}
	if(minMax[0] != minMax[1]){
		var value = Math.floor((minMax[0] + (((minMax[1] - minMax[0])/50) * (level)) * multi));
	} else {
		var value = minMax[1] * multi
	}
	return value
}

function createDescription(effect){
	var description = ""
	if(effect.requiresSuccess == 0){
		description += "All"
	}
	if(effect.requiresSuccess == 1){
		description += "All successful"
	}
	if(effect.requiresSuccess == 2){
		description += "All tied"
	}
	if(effect.requiresSuccess == -1){
		description += "All failed"
	}
	if(effect.effectOnMoves.length == 3){
		description += " attacks"
	} else {
		if(effect.effectOnMoves.indexOf("0") != -1){
			description += " rushes"
		}
		if(effect.effectOnMoves.indexOf("1") != -1){
			if(effect.effectOnMoves.indexOf("0") != -1){
				description += " and"	
			}
			description += " strikes"
		}
		if(effect.effectOnMoves.indexOf("2") != -1){
			if(effect.effectOnMoves.indexOf("1") != -1 || effect.effectOnMoves.indexOf("0") != -1){
				description += " and"	
			}
			description += " counters"
		}
	}
	if(effect.requiresCounters){
		if(effect.requiredCounters.length != undefined){
			if(effect.requiredCounters[0] > 0){
				description += " after " + (effect.requiredCounters[0]) + " rushes"
			}
			if(effect.requiredCounters[1] > 0){
				if(effect.requiredCounters[0] > 0){
					description += " and"
				}
				description += " after " + (effect.requiredCounters[1]) + " strikes"
			}
			if(effect.requiredCounters[2] > 0){
				if(effect.requiredCounters[1] > 0){
					description += " and"
				}
				description += " after " + (effect.requiredCounters[2]) + " counters"
			}
		} else {
			if(effect.requiredCounters == 1){
				description += " that are the first attack of a duel"
			} else {
				description += " after " + effect.requiredCounters + " attacks"		
			}
		}
	}
	if(effect.chance > 0){
		description += " have a " + effect.chance + "% chance to" 
	} else {
		description += ","
	}
	if(effect.clearCounters){
		description += " clear attack history and"
	}
	if(effect.recoil[1] != 0){
		description += " deal RECOIL recoil damage"
	}
	if(effect.modifier[1] != 0){
		if(effect.recoil[1] != 0){
			description += " and"
		}
		if(effect.effectModifier == "damage"){
			description += " deal MODIFIER base damage"
		}
		if(effect.effectModifier == "%damage"){
			description += " deal PER% of target's current health as additional damage"
		}
		if(effect.effectModifier == "heal"){
			description += " heal for MODIFIER health"
		}
		if(effect.effectModifier == "lessdamage"){
			description += " deal MODIFIER less base damage"
		}
	}
	if(effect.modiferValueEqualsCounters){
		if(effect.equalCounter == "0"){
			description += " for each previous rush"	
		}
		if(effect.equalCounter == "1"){
			description += " for each previous strike"	
		}
		if(effect.equalCounter == "2"){
			description += " for each previous counter"	
		}
	}
	if(effect.applyStatus){
		if(effect.modifier[1] != 0 || effect.recoil[1] != 0){
			description += " and causes"
		} else {
			description += " cause"
		}
		if(effect.statusEffect == "wound"){
			description += " a wound effect for STRENGTH damage"
		}
		if(effect.statusEffect == "stun"){
			description += " a stun effect"
		}
		if(effect.statusEffect == "stagger"){
			description += " a stagger effect"
		}
		if(effect.statusEffect == "dizzy"){
			description += " a dizzy effect for SER% of target's base attack damage"
		}
		if(effect.statusEffect == "invulnerable"){
			description += " a invulnerability effect"
		}
		if(effect.statusEffect == "speAug" || effect.statusEffect == "speMod"){
			if(effect.statusStrength[0] > 1){
				description += " a hasting effect of SER%"
			} else {
				description += " a hindering effect of SER%"
			}
		}
		if(effect.statusEffect == "strAug" || effect.statusEffect == "strMod"){
			if(effect.statusStrength[0] > 1){
				description += " a empowring effect of SER%"
			} else {
				description += " a weakening effect of SER%"
			}
		}
		if(effect.statusEffect == "resAug" || effect.statusEffect == "resMod"){
			if(effect.statusStrength[0] > 1){
				description += " a fortifying effect of SER%"
			} else {
				description += " a exposing effect of SER%"
			}
		}
		if(effect.statusTarget == "enemy"){
			description += " on an enemy"
		}
		if(effect.statusTarget == "self"){
			description += " on the user"
		}
		description += " for " + effect.statusDuration + " turn(s)"
	}
    description += "."
    return description
    .replace(/RECOIL/g,(Math.ceil(findScaledValue(effect.recoil,1))) + " - " + (Math.ceil(findScaledValue(effect.recoil,50))))
    .replace(/MODIFIER/g,(Math.ceil(findScaledValue(effect.modifier,1))) + " - " + Math.ceil(findScaledValue(effect.modifier,50)))
    .replace(/PER/g,Math.ceil(findScaledValue(effect.modifier,50,100)))
    .replace(/SER/g,Math.ceil(findScaledValue(effect.statusStrength,50,100)))
    .replace(/STRENGTH/g,(Math.ceil(findScaledValue(effect.statusStrength,1,1))) + " - " + (Math.ceil(findScaledValue(effect.statusStrength,50,1))))
	
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


function filterWeapons(){
    resetDisplay(0)
    populateItems("weapons",{tier:document.getElementById("weaponTierSelected").value},{normal:document.getElementById("weaponSortSelected").value})
}

function filterItems(){

    resetDisplay(1)
    populateItems("items",{tier:document.getElementById("itemTierSelected").value,type:document.getElementById("itemTypeSelected").value},{normal:document.getElementById("itemSortSelected").value,fusion:document.getElementById("itemFusionSortSelected").value})
}

function filterCreatures(){
    resetDisplay(2)
    populateItems("creatures",{tier:document.getElementById("creatureTierSelected").value},{normal:document.getElementById("creatureSortSelected").value})
}

function filterEffects(){
    resetDisplay(3)
    populateItems("effects",{
        modifier:document.getElementById("effectFilterModifier").value,
        status:document.getElementById("effectFilterStatus").value,
        trigger:document.getElementById("effectFilterTrigger").value
    },{normal:document.getElementById("effectSortSelected").value})
}

function populateItems(type,filter,sort){
    switch(type){
        case "weapons":
            var weaponsData = firebase.database().ref("weapons");
            weaponsData.once('value').then(function(snapshot){
                var weaponsRaw = snapshot.val()
                var weapons = []
                for(var weapon of weaponsRaw){
                    var breakOut = false;
                    if(filter.tier != "0"){
                        breakOut = filter.tier != String(weapon.tier)
                    }
                    if(!breakOut){
                        weapons.push(weapon)
                    }
                }
                if(sort.normal != 0){
                    switch(sort.normal){
                        case "1":
                            weapons.reverse();
                            break;
                        case "2":
                            weapons.sort(function(a,b){
                                if(a.name > b.name){
                                    return 1
                                } else if(a.name < b.name){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "3":
                            weapons.sort(function(a,b){
                                if(a.name > b.name){
                                    return -1
                                } else if(a.name < b.name){
                                    return 1
                                }
                                return 0
                            })
                            break;
                        case "4":
                            weapons.sort(function(a,b){
                                var aT = a.tier
                                var bT = b.tier
                                if(a.tier == 10){
                                    aT = 90
                                }
                                if(b.tier == 10){
                                    bT = 90
                                }
                                if(String(aT) > String(bT)){
                                    return 1
                                } else if(String(aT) < String(bT)){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "5":
                            weapons.sort(function(a,b){
                                var aD = a.moveDamage[0][1]
                                var bD = b.moveDamage[0][1]
                                if(aD > bD){
                                    return -1
                                } else if(aD < bD){
                                    return 1
                                }
                                return 0
                            })
                            break;
                        case "6":
                            weapons.sort(function(a,b){
                                var aD = a.moveDamage[1][1]
                                var bD = b.moveDamage[1][1]
                                if(aD > bD){
                                    return -1
                                } else if(aD < bD){
                                    return 1
                                }
                                return 0
                            })
                            break;
                        case "7":
                            weapons.sort(function(a,b){
                                var aD = a.moveDamage[2][1]
                                var bD = b.moveDamage[2][1]
                                if(aD > bD){
                                    return -1
                                } else if(aD < bD){
                                    return 1
                                }
                                return 0
                            })
                            break;
                        case "8":
                            weapons.sort(function(a,b){
                                var aD = a.moveDamage[0][1] + a.moveDamage[1][1] + a.moveDamage[2][1]
                                var bD = b.moveDamage[0][1] + b.moveDamage[1][1] + b.moveDamage[2][1]
                                if(aD > bD){
                                    return -1
                                } else if(aD < bD){
                                    return 1
                                }
                                return 0
                            })
                            break;
                    }
                }
                for(var weapon of weapons){
                    if(weapon.id > 0){
                        var weaponDiv = document.createElement("div")
                        weaponDiv.classList.add("weaponDiv")
                        
                        var name = document.createElement("h1")
                        name.classList.add("weaponName")
                        name.innerHTML = weapon.name;
                        weaponDiv.appendChild(name)

                        var id = document.createElement("p")
                        id.classList.add("weaponID")
                        id.innerHTML = weapon.id;
                        weaponDiv.appendChild(id)

                        var tier = document.createElement("p")
                        tier.classList.add("weaponTier")
                        tier.innerHTML = weapon.tier;
                        weaponDiv.appendChild(tier)

                        var description = document.createElement("p")
                        description.classList.add("weaponDescription")
                        description.innerHTML = weapon.description;
                        weaponDiv.appendChild(description)
                    
                        var stats = document.createElement("ul")
                        stats.classList.add("statsList")

                        var rush = document.createElement("li")
                        rush.innerHTML = "Rush Damage: " + weapon.moveDamage[0][0] + " - " +weapon.moveDamage[0][1]
                        stats.appendChild(rush)

                        var strike = document.createElement("li")
                        strike.innerHTML = "Strike Damage: " + weapon.moveDamage[1][0] + " - " +weapon.moveDamage[1][1]
                        stats.appendChild(strike)

                        var counter = document.createElement("li")
                        counter.innerHTML = "Counter Damage: " + weapon.moveDamage[2][0] + " - " +weapon.moveDamage[2][1]
                        stats.appendChild(counter)
                        
                        weaponDiv.appendChild(stats)
                        
                        if(weapon.effects){
                            var effects = document.createElement("ul")
                            effects.classList.add("effectsList")
                            for(var effect of weapon.effects){
                                var effectelement = document.createElement("li")
                                effectelement.innerHTML = effect
                                effects.appendChild(effectelement)
                            }
                            weaponDiv.appendChild(effects)
                        }
                        document.getElementById("reel").appendChild(weaponDiv)
                    }
                }
            })
            break
        case "items":
            var itemsData = firebase.database().ref("drops");
            itemsData.once('value').then(function(snapshot){
                var itemsRaw = snapshot.val()
                var items = []
                for(var item of itemsRaw){
                    var breakOut = false;
                    if(filter.type != "0"){
                        breakOut = filter.type != String(item.type) || (filter.type == "mob" && item.type == "special")
                        if(item.tier == "Attribute"){
                            filter.tier = "0"
                        }
                    }
                    if(filter.tier != "0" && !breakOut){
                        breakOut = filter.tier != String(item.tier)
                    }
                    if(!breakOut){
                        items.push(item)
                    }
                }
                if(sort.normal != 0){
                    switch(sort.normal){
                        case "1":
                            items.reverse();
                            break;
                        case "2":
                            items.sort(function(a,b){
                                if(a.name > b.name){
                                    return 1
                                } else if(a.name < b.name){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "3":
                            items.sort(function(a,b){
                                if(a.name > b.name){
                                    return -1
                                } else if(a.name < b.name){
                                    return 1
                                }
                                return 0
                            })
                            break;
                        case "4":
                            items.sort(function(a,b){
                                var aT = a.tier
                                var bT = b.tier
                                if(a.tier == 10){
                                    aT = 90
                                }
                                if(b.tier == 10){
                                    bT = 90
                                }
                                if(String(aT) > String(bT)){
                                    return 1
                                } else if(String(aT) < String(bT)){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "5":
                        items.sort(function(a,b){
                            if(a.type > b.type){
                                return 1
                            } else if(a.type < b.type){
                                return -1
                            }
                            return 0
                        })
                        break;
                    }
                }
                if(sort.fusion != 0){
                    switch(sort.fusion){
                        case "1":
                            items.sort(function(a,b){
                                var aval = a.r_dmgbuff * 100 
                                var bval = b.r_dmgbuff * 100
                                if(aval < bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return;
                            })
                            break;
                        case "2":
                            items.sort(function(a,b){
                                var aval = a.s_dmgbuff
                                var bval = b.s_dmgbuff
                                if(aval< bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "3":
                            items.sort(function(a,b){
                                var aval = a.c_dmgbuff
                                var bval = b.c_dmgbuff
                                if(aval< bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "4":
                            items.sort(function(a,b){
                                var aval = a.r_resisbuff
                                var bval = b.r_resisbuff
                                if(aval< bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "5":
                            items.sort(function(a,b){
                                var aval = a.s_resisbuff
                                var bval = b.s_resisbuff
                                if(aval< bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "6":
                            items.sort(function(a,b){
                                var aval = a.c_resisbuff
                                var bval = b.c_resisbuff
                                if(aval< bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return 0
                            })
                            break
                        case "7":
                            items.sort(function(a,b){
                                var aval = a.r_dmgbuff + a.s_dmgbuff + a.c_dmgbuff
                                var bval = b.r_dmgbuff + b.s_dmgbuff + b.c_dmgbuff
                                if(aval< bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return 0
                            })
                            break
                        case "8":
                            items.sort(function(a,b){
                                var aval = a.r_resisbuff + a.s_resisbuff + a.c_resisbuff
                                var bval = b.r_resisbuff + b.s_resisbuff + b.c_resisbuff
                                if(aval< bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return 0
                            })
                            break
                        case "9":
                            items.sort(function(a,b){
                                var aval = a.r_resisbuff + a.s_resisbuff + a.c_resisbuff + a.r_dmgbuff + a.s_dmgbuff + a.c_dmgbuff
                                var bval = b.r_resisbuff + b.s_resisbuff + b.c_resisbuff + b.r_dmgbuff + b.s_dmgbuff + b.c_dmgbuff
                                if(aval< bval){
                                    return 1
                                } else if(aval > bval){
                                    return -1
                                }
                                return 0
                            })
                            break
                    }
                }
                for(var item of items){
                    if(filter.type == "mob"){
                        document.getElementById("sortFusionTag").classList.remove("hidden")
                        document.getElementById("itemFusionSortSelected").classList.remove("hidden")
                        document.getElementById("fusionsTitle").classList.remove("hidden")
                        document.getElementById("typeTitle").classList.add("hidden")
                        document.getElementById("itemSortSelected").classList.add("hidden")
                        document.getElementById("sortTag").classList.add("hidden")
                    } else {
                        document.getElementById("sortFusionTag").classList.add("hidden")
                        document.getElementById("itemFusionSortSelected").classList.add("hidden")
                        document.getElementById("fusionsTitle").classList.add("hidden")
                        document.getElementById("typeTitle").classList.remove("hidden")
                        document.getElementById("itemSortSelected").classList.remove("hidden")
                        document.getElementById("sortTag").classList.remove("hidden")
                    }
                    if(item.id > 0){
                        var itemDiv = document.createElement("div")
                        itemDiv.classList.add("itemDiv")
                        
                        var name = document.createElement("h1")
                        name.classList.add("itemName")
                        name.innerHTML = item.name;
                        itemDiv.appendChild(name)

                        var id = document.createElement("p")
                        id.classList.add("itemID")
                        id.innerHTML = item.id;
                        itemDiv.appendChild(id)

                        var tier = document.createElement("p")
                        tier.classList.add("itemTier")
                        tier.innerHTML = item.tier;
                        itemDiv.appendChild(tier)

                        var description = document.createElement("p")
                        description.classList.add("itemDescription")
                        description.innerHTML = item.description;
                        itemDiv.appendChild(description)

                        if(filter.type == "mob"){
                            var fusions = document.createElement("ul")
                            fusions.classList.add("fusionsList")
    
                            var rush = document.createElement("li")
                            rush.innerHTML = "Rush Damage Boost: " + item.r_dmgbuff * 100 + "%"
                            fusions.appendChild(rush)
    
                            var strike = document.createElement("li")
                            strike.innerHTML = "Strike Damage Boost: " + item.s_dmgbuff * 100 + "%"
                            fusions.appendChild(strike)
    
                            var counter = document.createElement("li")
                            counter.innerHTML = "Counter Damage Boost: " + item.c_dmgbuff * 100 + "%"
                            fusions.appendChild(counter)
                            
                            var rush1 = document.createElement("li")
                            rush1.innerHTML = "Rush Resistance Boost: " + item.r_resisbuff * 100 + "%"
                            fusions.appendChild(rush1)
    
                            var strike1 = document.createElement("li")
                            strike1.innerHTML = "Strike Resistance Boost: " + item.s_resisbuff * 100 + "%"
                            fusions.appendChild(strike1)
    
                            var counter1 = document.createElement("li")
                            counter1.innerHTML = "Counter Resistance Boost: " + item.c_resisbuff * 100 + "%"
                            fusions.appendChild(counter1)
    
                            itemDiv.appendChild(fusions)    
                        } else {
                            var type = document.createElement("h1")
                            type.classList.add("itemType")
                            type.innerHTML = item.type.replace("mob","fusion");
                            itemDiv.appendChild(type)
                        }

                        document.getElementById("reel").appendChild(itemDiv)
                    }
                }
            })
            break;
        case "creatures":
            var creaturesData = firebase.database().ref("creatures");
                creaturesData.once('value').then(function(snapshot){
                    var creaturesRaw = snapshot.val()
                    var creatures = []
                    for(var creature of creaturesRaw){
                        var breakOut = false;
                        if(filter.tier != "0"){
                            breakOut = filter.tier != String(creature.tier)
                        }
                        if(!breakOut){
                            creatures.push(creature)
                        }
                    }
                    if(sort.normal != 0){
                        switch(sort.normal){
                            case "1":
                                creatures.reverse();
                                break;
                            case "2":
                                creatures.sort(function(a,b){
                                    if(a.name > b.name){
                                        return 1
                                    } else if(a.name < b.name){
                                        return -1
                                    }
                                    return 0
                                })
                                break;
                            case "3":
                                creatures.sort(function(a,b){
                                    if(a.name > b.name){
                                        return -1
                                    } else if(a.name < b.name){
                                        return 1
                                    }
                                    return 0
                                })
                                break;
                            case "4":
                                creatures.sort(function(a,b){
                                    var aT = a.tier
                                    var bT = b.tier
                                    if(a.tier == 10){
                                        aT = 90
                                    }
                                    if(b.tier == 10){
                                        bT = 90
                                    }
                                    if(String(aT) > String(bT)){
                                        return 1
                                    } else if(String(aT) < String(bT)){
                                        return -1
                                    }
                                    return 0
                                })
                                break;
                        }
                    }
                    for(var creature of creatures){
                        var creatureDiv = document.createElement("div")
                        creatureDiv.classList.add("creatureDiv")
                        
                        var name = document.createElement("h1")
                        name.classList.add("creatureName")
                        name.innerHTML = creature.name;
                        creatureDiv.appendChild(name)

                        var id = document.createElement("p")
                        id.classList.add("creatureID")
                        id.innerHTML = creature.id;
                        creatureDiv.appendChild(id)

                        var tier = document.createElement("p")
                        tier.classList.add("creatureTier")
                        tier.innerHTML = creature.tier;
                        creatureDiv.appendChild(tier)

                        var tier = document.createElement("h3")
                        tier.classList.add("creatureWeapon")
                        tier.innerHTML = creature.weapon.name;
                        creatureDiv.appendChild(tier)

                        if(creature.drops){
                            var drops = document.createElement("ul")
                            drops.classList.add("dropsList")
                            creature.drops.sort(function(a,b){
                                if(a.chance > b.chance){
                                    return -1
                                } else if(a.chance < b.chance){
                                    return 1
                                }
                                return 0
                            })
                            for(var drop of creature.drops){
                                var dropelement = document.createElement("li")
                                if(drop.name != "nothing"){
                                    dropelement.innerHTML = drop.name + ": " + drop.chance + "%"
                                } else {
                                    dropelement.innerHTML = "Nothing: " + parseFloat(drop.chance).toPrecision(2) + "%"
                                }
                                drops.appendChild(dropelement)
                            }
                            creatureDiv.appendChild(drops)
                        }

                        document.getElementById("reel").appendChild(creatureDiv)
                    }
                })
                break;
        case "effects":
            var effectsData = firebase.database().ref("effects");
            effectsData.once('value').then(function(snapshot){
                var effectsRaw = snapshot.val()
                var effects = []
                for(var effect of effectsRaw){
                    var breakOut = false;
                    if(filter.modifier != "0"){
                        if(filter.modifier == "none"){
                            if(effect.modifier[1] != 0){
                                breakOut = true
                            }
                        } else if(filter.modifier != effect.effectModifier || effect.modifier[1] == 0){
                            breakOut = true
                        }
                    }
                    if(filter.status != "0"){
                        if(filter.status == "none"){
                            if(effect.applyStatus == true){
                                breakOut = true
                            }
                        } else if(filter.status != effect.statusEffect || !effect.applyStatus){
                            breakOut = true
                        }
                    }
                    if(filter.trigger != "-1"){
                        if(!effect.effectOnMoves.includes(filter.trigger)){
                            breakOut = true
                        }
                    }
                    if(!breakOut){
                        effects.push(effect)
                    }
                }
                if(sort.normal != 0){
                    switch(sort.normal){
                        case "1":
                            effects.reverse();
                            break;
                        case "2":
                            effects.sort(function(a,b){
                                if(a.name > b.name){
                                    return 1
                                } else if(a.name < b.name){
                                    return -1
                                }
                                return 0
                            })
                            break;
                        case "3":
                            effects.sort(function(a,b){
                                if(a.name > b.name){
                                    return -1
                                } else if(a.name < b.name){
                                    return 1
                                }
                                return 0
                            })
                            break;
                    }
                }
                var weaponsData = firebase.database().ref("weapons");
                weaponsData.once('value').then(function(snapshot1){
                    var weaponsData = snapshot1.val();
                    for(var effect of effects){
                        var effectDiv = document.createElement("div")
                        effectDiv.classList.add("effectDiv")
                        
                        var name = document.createElement("h1")
                        name.classList.add("effectName")
                        name.innerHTML = effect.name;
                        effectDiv.appendChild(name)

                        var id = document.createElement("p")
                        id.classList.add("effectID")
                        id.innerHTML = effect.id;
                        effectDiv.appendChild(id)

                        var description = document.createElement("p")
                        description.classList.add("effectDescription")
                        description.innerHTML = createDescription(effect)
                        effectDiv.appendChild(description)

                        var weapons = document.createElement("ul")
                        weapons.classList.add("effectDefaultWeapons")
                        if(effect.weaponIDs){
                            for(var id of effect.weaponIDs){
                                var weaponElement = document.createElement("li")
                                weaponElement.innerHTML = weaponsData[id].name
                                weapons.appendChild(weaponElement)
                            }
                        } else {
                            var weaponElement = document.createElement("li")
                            weaponElement.innerHTML = "None"
                            weapons.appendChild(weaponElement)
                        }
                        
                        effectDiv.appendChild(weapons)

                        document.getElementById("reel").appendChild(effectDiv)
                    }
                })
            })    
            break;
    }
}