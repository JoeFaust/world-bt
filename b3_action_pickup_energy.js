var PickupEnergy = b3.Class(b3.Action, {
	name: 'PickupEnergy',
	
	
	tick: function(tick) {
		var creep = tick.target;
		
	    if(creep.carry.energy < creep.carryCapacity) {
            var energy = creep.room.find(FIND_DROPPED_ENERGY);
            if(creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(energy[0]);
            }
            
            return b3.RUNNING;
        }
	    
	    return b3.SUCCESS;
	}
});

module.exports = PickupEnergy;