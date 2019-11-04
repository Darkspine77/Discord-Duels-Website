function filterCreatures(){
    resetDisplay(2)
    populateItems("creatures",{tier:document.getElementById("creatureTierSelected").value},{normal:document.getElementById("creatureSortSelected").value})
}

function populateCreatureContent(type,filter,sort){
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
            creatureDiv.classList.add("contentDiv")
            
            var name = document.createElement("a")
            name.classList.add("creatureName")
            name.innerHTML = creature.name;
            name.href = "display.html?contentType=creature&id=" + (creature.id - 1)
            creatureDiv.appendChild(name)

            var id = document.createElement("p")
            id.classList.add("creatureID")
            id.innerHTML = creature.id;
            creatureDiv.appendChild(id)

            var tier = document.createElement("p")
            tier.classList.add("creatureTier")
            tier.innerHTML = creature.tier;
            creatureDiv.appendChild(tier)

            var weapon = document.createElement("a")
            weapon.classList.add("creatureWeapon")
            weapon.innerHTML = creature.weapon.name;
            weapon.href = "display.html?contentType=weapon&id=" + (creature.weapon.id)
            creatureDiv.appendChild(weapon)

            if(creature.drops){
                var drops = document.createElement("ul")
                drops.classList.add("dropsList")
                for(var drop of creature.drops){
                    var dropelement = document.createElement("li")
                    if(drop.id){
                        var droplink = document.createElement("a")
                        if(drop.level){
                            droplink.href = "display.html?contentType=weapon&id=" + (drop.id)
                        } else {
                            droplink.href = "display.html?contentType=item&id=" + (drop.id - 1)
                        }
                        droplink.innerHTML = drop.name
                        dropelement.appendChild(droplink)
                    } else {
                        if(drop.name != "nothing"){
                            dropelement.innerHTML = drop.name + ": " + drop.chance + "%"
                        } else {
                            dropelement.innerHTML = "Nothing: " + parseFloat(drop.chance).toPrecision(2) + "%"
                        }
                    }
                    
                    drops.appendChild(dropelement)
                }
                creatureDiv.appendChild(drops)
            }

            addToReel(creatureDiv)
        }
    })
}