var RepairDefault = b3.Class(b3.Action, {
	name: 'RepairDefault',
	
	
	tick: function(tick) {
		var creep = tick.target;
		//console.log("RepairDefault for creep: "+creep);
		
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });
        
        //console.log("Repair targets:",targets);
        
        if(targets.length) {
        	var result = creep.repair(targets[0]);
            if(result === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
                return b3.RUNNING;
            } else if (result === OK) {
            	return b3.RUNNING;
            } else if(result === ERR_NOT_ENOUGH_RESOURCES) {
            	return b3.SUCCESS;
            } else {
            	console.log("Unexpected result in RepairDefault: "+result);
            	return b3.FAILURE;
            }
        } else {
        	return b3.FAILURE;
        }
	}
});

module.exports = RepairDefault;