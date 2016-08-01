var WithdrawEnergy = b3.Class(b3.Action, {
	name: 'WithdrawEnergy',
	
	
	tick: function(tick) {
		var creep = tick.target;
		//console.log("WithdrawEnergy for creep: "+creep);
		
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION
                		|| structure.structureType == STRUCTURE_SPAWN
                        ) && (structure.energy > 100);
            }
        });
        
        var stores = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structyreType == STRUCTURE_STORAGE 
                		|| structure.structureType == STRUCTURE_CONTAINER
                        ) && structure.store[RESOURCE_ENERGY] > 100;
            }
        	
        })
        
        var target = null;
	    if(targets.length > 0) {
	    	target = targets[0];
	    } else if (stores.length > 0) {
	    	target = stores[0];
		} else {
			return b3.FAILURE
		}
	    //console.log("Withdraw target:",target);
    	var result = creep.withdraw(target, RESOURCE_ENERGY);
        if(result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return b3.RUNNING;
        } else if(result === ERR_BUSY) {
        	return b3.RUNNING;
        } else if (result === OK || result === ERR_FULL) {
	        return b3.SUCCESS;
        } else {
        	console.log("Unexpected result in WithdrawEnergy: "+result);
        	return b3.FAILURE;
        }
	}
});

module.exports = WithdrawEnergy;