var BuildDefault = b3.Class(b3.Action, {
	name: 'BuildDefault',
	
	
	tick: function(tick) {
		var creep = tick.target;
		//console.log("BuildDefault for creep: "+creep);
		
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
        	var result = creep.build(targets[0]);
            if(result === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
                return b3.RUNNING;
            } else if (result === OK) {
            	return b3.RUNNING;
            } else if(result === ERR_NOT_ENOUGH_RESOURCES) {
            	return b3.SUCCESS;
            } else {
            	console.log("Unexpected result in BuildDefault: "+result);
            	return b3.FAILURE;
            }
        } else {
        	return b3.FAILURE;
        }
	}
});

module.exports = BuildDefault;