var FrequencyCheck = b3.Class(b3.Condition);

FrequencyCheck.prototype.name = 'FrequencyCheck';

FrequencyCheck.prototype.initialize = function(settings) {
	if (!settings || !settings.frequency) {
		throw new Error('frequency must be defined for FrequencyCheck');
	}

	b3.Condition.prototype.initialize.call(this);
	this.frequency = settings.frequency;
},

FrequencyCheck.prototype.tick = function(tick) {

	if (Game.time % this.frequency === 0) {
		return b3.SUCCESS;
	}

	return b3.FAILURE;
}

module.exports = FrequencyCheck;