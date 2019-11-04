function filterItems(){
    resetDisplay(1)
    populateItems("items",{tier:document.getElementById("itemTierSelected").value,type:document.getElementById("itemTypeSelected").value},{normal:document.getElementById("itemSortSelected").value,fusion:document.getElementById("itemFusionSortSelected").value})
}

function populateItemContent(type,filter,sort){
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
                itemDiv.classList.add("contentDiv")
                
                var name = document.createElement("a")
                name.classList.add("itemName")
                name.innerHTML = item.name;
                name.href = "display.html?contentType=item&id=" + (item.id - 1)
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

                addToReel(itemDiv)
            }
        }
    })
}