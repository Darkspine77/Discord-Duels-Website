function populateEffectContent(type,filter,sort){
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
                effectDiv.classList.add("contentDiv")
                
                var name = document.createElement("a")
                name.classList.add("effectName")
                name.innerHTML = effect.name;
                name.href = "display.html?contentType=effect&id=" + (effect.id)
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
                        var weaponLink = document.createElement("a")
                        weaponLink.href = "display.html?contentType=weapon&id=" + id
                        weaponLink.innerHTML = weaponsData[id].name
                        weaponElement.appendChild(weaponLink)
                        weapons.appendChild(weaponElement)
                    }
                } else {
                    var weaponElement = document.createElement("li")
                    weaponElement.innerHTML = "None"
                    weapons.appendChild(weaponElement)
                }
                
                effectDiv.appendChild(weapons)

                addToReel(effectDiv)
            }
        })
    })    
}