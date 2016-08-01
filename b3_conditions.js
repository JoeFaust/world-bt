
(function() {
	"use strict";
	b3.FrequencyCheck = b3.Class(b3.Condition);

	b3.FrequencyCheck.prototype.name = 'FrequencyCheck';

	b3.FrequencyCheck.prototype.initialize = function(settings) {
		if (!settings || !settings.frequency) {
			throw new Error('frequency must be defined for FrequencyCheck');
		}

		b3.Condition.prototype.initialize.call(this);
		this.frequency = settings.frequency;
	},

	b3.FrequencyCheck.prototype.tick = function(tick) {

		if (Game.time % this.frequency === 0) {
			return b3.SUCCESS;
		}

		return b3.FAILURE;
	}
})();

(function() {
	"use strict";
	b3.RoleCheck = b3.Class(b3.Condition);

	b3.RoleCheck.prototype.name = 'RoleCheck';

	b3.RoleCheck.prototype.initialize = function(settings) {
		if (!settings || !settings.role) {
			throw new Error('role must be defined for RoleCheck');
		}

		b3.Condition.prototype.initialize.call(this);
		this.role = settings.role;
	},

	b3.RoleCheck.prototype.tick = function(tick) {
		var creep = tick.target;
		//console.log("ConditionRoleCheck for creep: "+creep+", role: "+creep.memory.role+", this.role="+this.role);

		if (creep.memory.role === this.role) {
			//console.log("RoleCheck return SUCCESS");
			return b3.SUCCESS;
		}

		//console.log("RoleCheck return FAILURE");
		return b3.FAILURE;
	}
})();
