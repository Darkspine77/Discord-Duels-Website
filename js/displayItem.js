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
            document.getElementById("itemTier").innerHTML = "Tier: " + data.tier
        }
        document.getElementById("itemID").innerHTML = "ID: " + data.id
        document.getElementById("itemValue").innerHTML = "Sell Value: " + data.sellValue
        document.getElementById("itemType").innerHTML = "Type: " + data.type
        document.getElementById("itemDesc").innerHTML = data.description
        if(data.type == "mob"){
            document.getElementById("fusionStats").style.display = "block";
            document.getElementById("rDamageMod").innerHTML = "Rush Damage Modifier: " + data.r_dmgbuff * 100 + "%"
            document.getElementById("sDamageMod").innerHTML = "Strike Damage Modifier: " + data.s_dmgbuff * 100 + "%"
            document.getElementById("cDamageMod").innerHTML = "Counter Damage Modifier: " + data.c_dmgbuff * 100 + "%"
            document.getElementById("rResistanceMod").innerHTML = "Rush Resistance Modifier: " + data.r_resisbuff * 100 + "%"
            document.getElementById("sResistanceMod").innerHTML = "Strike Resistance Modifier: " + data.s_resisbuff * 100 + "%"
            document.getElementById("cResistanceMod").innerHTML = "Counter Resistance Modifier: " + data.c_resisbuff * 100 + "%"
        } else {
            document.getElementById("itemDesc").style.display = "block";
            document.getElementById("itemDesc").innerHTML = printItemFunction(data,function(result){
                document.getElementById("itemDesc").innerHTML = result
            })
        }
        if(data.creatureIDs){
            for(var creature of supplementaryData.creatures){
                console.log(creature)
                var creatureDiv = document.createElement("div")
                creatureDiv.id = "itemLocation"
                
                var creatureName = document.createElement("h2")
                var creatureLink = document.createElement("a")
                creatureLink.href = "display.html?contentType=creature&id=" + creature[0].id
                creatureLink.innerHTML = creature[0].name
                creatureName.appendChild(creatureLink)
                creatureDiv.appendChild(creatureName)
        
                var creatureDescription = document.createElement("p")
                creatureDescription.innerHTML = creature[1] + "% Drop Chance"
                creatureDiv.appendChild(creatureDescription)
        
                document.getElementById("itemLocations").appendChild(creatureDiv)
            }
        }
    })
}