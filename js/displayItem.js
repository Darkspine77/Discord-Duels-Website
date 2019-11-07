function loadExternalItemData(callback){
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
            document.getElementById("itemLocations").style.display = "block";
            callback()
        })
    } else {
        callback()
    }
}

function visualizeItem(){
    loadExternalItemData(function(){
        document.getElementById("itemTitle").innerHTML = data.name
        if(data.tier != "none"){
            document.getElementById("itemTier").innerHTML = data.tier
        }
        document.getElementById("itemID").innerHTML = data.id
        document.getElementById("itemValue").innerHTML = data.sellValue
        document.getElementById("itemType").innerHTML = data.type
        document.getElementById("itemDesc").innerHTML = data.description
        if(data.type == "mob"){
            document.getElementById("fusionStats").style.display = "block";
            document.getElementById("rDamageMod").innerHTML = data.r_dmgbuff * 100 + "%"
            document.getElementById("sDamageMod").innerHTML = data.s_dmgbuff * 100 + "%"
            document.getElementById("cDamageMod").innerHTML = data.c_dmgbuff * 100 + "%"
            document.getElementById("rResistanceMod").innerHTML = data.r_resisbuff * 100 + "%"
            document.getElementById("sResistanceMod").innerHTML = data.s_resisbuff * 100 + "%"
            document.getElementById("cResistanceMod").innerHTML = data.c_resisbuff * 100 + "%"
        } else {
            document.getElementById("itemFunctionContainer").style.gridArea = "stats"
            document.getElementById("itemFunctionContainer").style.display = "block";
            document.getElementById("itemFunction").innerHTML = printItemFunction(data,function(result){
                document.getElementById("itemFunction").innerHTML = result
            })
        }
        if(data.creatureIDs){
            for(var creature of supplementaryData.creatures){
                console.log(creature)
                var creatureDiv = document.createElement("div")
                creatureDiv.id = "itemLocation"
                
                var creatureName = document.createElement("h2")
                var creatureLink = document.createElement("a")
                creatureLink.classList.add("headingText2")
                creatureLink.href = "display.html?contentType=creature&id=" + creature[0].id
                creatureLink.innerHTML = creature[0].name
                creatureName.appendChild(creatureLink)
                creatureDiv.appendChild(creatureName)
        
                var creatureDescription = document.createElement("p")
                creatureDescription.innerHTML = creature[1] + "% Drop Chance"
                creatureDescription.classList.add("contentText")
                creatureDiv.appendChild(creatureDescription)
        
                document.getElementById("itemLocations").appendChild(creatureDiv)
            }
        }
    })
}