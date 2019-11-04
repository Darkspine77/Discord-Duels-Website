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

function createDescription(effect,level){
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
    if(level){
        return description
        .replace(/RECOIL/g,(Math.ceil(findScaledValue(effect.recoil,level))))
        .replace(/MODIFIER/g,(Math.ceil(findScaledValue(effect.modifier,level))))
        .replace(/PER/g,Math.ceil(findScaledValue(effect.modifier,50,100)))
        .replace(/SER/g,Math.ceil(findScaledValue(effect.statusStrength,50,100)))
        .replace(/STRENGTH/g,(Math.ceil(findScaledValue(effect.statusStrength,1,level))))
    } else {
        return description
        .replace(/RECOIL/g,(Math.ceil(findScaledValue(effect.recoil,1))) + " - " + (Math.ceil(findScaledValue(effect.recoil,50))))
        .replace(/MODIFIER/g,(Math.ceil(findScaledValue(effect.modifier,1))) + " - " + Math.ceil(findScaledValue(effect.modifier,50)))
        .replace(/PER/g,Math.ceil(findScaledValue(effect.modifier,50,100)))
        .replace(/SER/g,Math.ceil(findScaledValue(effect.statusStrength,50,100)))
        .replace(/STRENGTH/g,(Math.ceil(findScaledValue(effect.statusStrength,1,1))) + " - " + (Math.ceil(findScaledValue(effect.statusStrength,50,1))))
    }
}

function printItemFunction(drop,callback){
	var finalMessage = ""
	if(drop.type == "attribute"){
		finalMessage += "Fusing with this sets your equipped weapon's"  
		if(drop.slot == 1){
			finalMessage += " elemental"
		} else {
			finalMessage +=	" structural"
		}
		finalMessage += " attribute to " + drop.attribute
		if(drop.slot == 1){
            var Data = firebase.database().ref("effects");
            Data.once('value').then(function(snapshot){
				var effects = snapshot.val()
                var attributes = {
                    "basic":"None (Removes your elemental effect)",
                    "flaming":createDescription(effects[103],0),
                    "frosted":createDescription(effects[104],0),
                    "electrified":createDescription(effects[105],0),
                    "corroding":createDescription(effects[249],0),
                    "terrestrial":createDescription(effects[250],0),
                    "living":createDescription(effects[251],0),
                    "spooky":createDescription(effects[236],0) + "\n" + createDescription(effects[237],0),	
                    "feral":createDescription(effects[330],0),
                    "royal":createDescription(effects[331],0),
                    "demonic":createDescription(effects[332],0),
                    "mechanical":createDescription(effects[333],0),
                    "ancient":createDescription(effects[334],0),
                    "distorted":createDescription(effects[335],0),
                    "jolly":createDescription(effects[374],0)
				}
				console.log(attributes[drop.attribute])
                callback("Sets your weapon's Elemental Effect to: " + attributes[drop.attribute])
            })
		} else {
			var modifications = {
				"basic":"None (Removes your structural effect)",
				"lightweight":"increases rush damage, but other damage types are lowered",
				"sharpened":"increases strike damage, but other damage types are lowered",
				"reinforced":"increases counter damage, but other damage types are lowered",
				"razor-edge":"increases rush and strike damage, but counter damage is gravely lowered",
				"blunt":"increases counter and strike damage, but rush damage is gravely lowered",
				"dense":"increases rush and counter damage, but strike damage is gravely lowered"
			}
            finalMessage += " which " + modifications[drop.attribute]
            return finalMessage            
		}
	} else if(drop.type == "chaos"){
			finalMessage += "When fusing with this item your equipped weapon is permanently unable to receive attributes and gains randomly generated improvements\nUpon fusing you will be made aware of the changes and will have the choice to either accept them and destroy this orb or ignore them.\nEither way this process will cost you chaos fragments based on the target weapon's tier."
            return finalMessage
        } else if(drop.type == "remnant"){
		finalMessage += "This items is used as a resource to create Tier " + drop.tier + " items and weapons using the *!forge command"
        return finalMessage
    } else if(drop.type == "resource"){
		finalMessage += "Acquiring this item will give you " + drop.amount + " " + drop.resource.replace(/_/g," ") + "."
        return finalMessage
    } else if(drop.type == "ultimate"){
		var ult_name = ""
		if(drop.ult == 0){
			ult_name += "Chaotic Surge"
		}
		if(drop.ult == 1){
			ult_name += "Rejuvination Burst"
		}
		if(drop.ult == 2){
			ult_name += "Ravager's Storm"
		}
		if(drop.ult == 3){
			ult_name += "Fatal Afliction"
		}
		if(drop.ult == 4){
			ult_name += "Gladiator's Rush"
		}
		if(drop.ult == 5){
			ult_name += "Exterminator's Strike"
		}
		if(drop.ult == 6){
			ult_name += "Warmonger's Counter"
		}
        finalMessage += "Fusing with this item changes a Lost One's ultimate ability to " + ult_name
        return finalMessage
	}
}