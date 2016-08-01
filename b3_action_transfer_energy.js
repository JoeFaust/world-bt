var TransferEnergy = b3.Class(b3.Action, {
	name: 'TransferEnergy',
	
	
	tick: function(tick) {
		var creep = tick.target;
		//console.log("TransferEnergy for creep: "+creep);
		
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        
	    if(targets.length > 0) {
	    	var result = creep.transfer(targets[0], RESOURCE_ENERGY);
	        if(result === ERR_NOT_IN_RANGE) {
	            creep.moveTo(targets[0]);
	            return b3.RUNNING;
	        } else if (result === OK) {
		        return b3.SUCCESS;
	        } else {
	        	console.log("Unexpected result in TransferEnergy: "+result);
	        	return b3.FAILURE;
	        }
	    }
	    return b3.FAILURE;
	}
});

module.exports = TransferEnergy;