function filterWeapons(){
    resetDisplay(0)
    populateItems("weapons",{tier:document.getElementById("weaponTierSelected").value},{normal:document.getElementById("weaponSortSelected").value})
}

function populateWeaponContent(type,filter,sort){
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
                weaponDiv.classList.add("contentDiv")
                
                var name = document.createElement("a")
                name.classList.add("weaponName")
                name.innerHTML = weapon.name;
                name.href = "display.html?contentType=weapon&id=" + weapon.id
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
                    for(var i in weapon.effects){
                        var effectelement = document.createElement("li")
                        var link = document.createElement("a")
                        link.href = "display.html?contentType=effect&id=" + (weapon.effectIDs[i])
                        link.innerHTML = weapon.effects[i]
                        effectelement.appendChild(link)
                        effects.appendChild(effectelement)
                    }
                    weaponDiv.appendChild(effects)
                }

                addToReel(weaponDiv)
            }
        }
    })
}