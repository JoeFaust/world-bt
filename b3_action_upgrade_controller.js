var UpgradeController = b3.Class(b3.Action, {
	name: 'UpgradeController',
	
	
	tick: function(tick) {
		var creep = tick.target;
		//console.log("UpgradeController for creep: "+creep);
		
    	var result = creep.upgradeController(creep.room.controller);
        if(result === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            return b3.RUNNING;
        } else if (result === OK) {
	        return b3.RUNNING;
        } else if(result === ERR_NOT_ENOUGH_RESOURCES) {
        	return b3.SUCCESS;
        } else {
        	console.log("Unexpected result in UpgradeController: "+result);
        	return b3.FAILURE;
        }	
    }
});

module.exports = UpgradeController;