
(function() {
	"use strict";

	b3.IdenfitySources = b3.Class(b3.Action, {
		name: 'IdenfitySources',


		tick: function(tick) {
			var room = tick.target;
			var sources = room.find(FIND_SOURCES);
			//console.log("IdentifySources.  room: "+room+", sources: "+sources);
			if(sources.length > 0) {
				var minerCount = 0;
				for(var i in sources) {
					var source = sources[i];


					if(source.pos.findInRange(FIND_STRUCTURES, 5, {filter: { structureType: STRUCTURE_KEEPER_LAIR }}).length > 0) {
						continue;
					} 

					var x = source.pos.x;
					var y = source.pos.y;
					var lookArea = room.lookAtArea(y-1, x-1, y+1, x+1, true);
					//console.log("Source:",source);
					//console.log("lookArea:",lookArea);

					for(var l in lookArea) {
						var look = lookArea[l];
						//console.log(look['x'],look['y'],look['type'],look['terrain']);
						if(look['type'] === LOOK_TERRAIN && (look[LOOK_TERRAIN] === 'plain' || look[LOOK_TERRAIN] === 'swamp')) {
							var flagName = "minerflag-"+room.name+"-"+minerCount++;
							if(room.createFlag(look['x'], look['y'], flagName, COLOR_BLUE) === flagName) {
								console.log("Created minerflag: "+flagName+" at: "+look['x']+","+look['y']);
							}
						}
					}
				}
				if(minerCount > 0) {
					room.memory['minerCount'] = minerCount;
				}
				return b3.SUCCESS;
			} else {
				return b3.FAILURE;
			}

			return b3.SUCCESS;
		}
	});
})();

(function() {
	"use strict";

	b3.DetermineRoomGoal = b3.Class(b3.Action, {
		name: 'DetermineRoomGoal',


		tick: function(tick) {
			var room = tick.target;

			room.memory['goal'] = 'upgrade';
			return b3.SUCCESS;
		}
	});
})();

(function() {
	"use strict";

	b3.SpawnCreeps = b3.Class(b3.Action, {
		name: 'SpawnCreeps',


		tick: function(tick) {
			var room = tick.target;

			var spawns = room.find(FIND_MY_STRUCTURES, {
				filter: { structureType : STRUCTURE_SPAWN }
			});
			if(spawns.length === 0) {
				return b3.FAILURE;
			}
			var spawn = spawns[0];
			if(spawn.spawning != null) {
				return b3.RUNNING;
			}

		    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
		    var upgraders =  _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
		    var builders =  _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
		    var miners =  _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
		    var transporters =  _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');

		    if(Object.keys(Game.creeps).length === 0) {
		    	this.spawnHarvester(room, spawn);
		    } else if(miners.length >= 1 && harvesters.length > 0) {
		    	harvesters[0].memory.role = 'transporter';
		    	console.log('Converting harvester to transporter');
		    } else if(miners.length < 3) {
		        this.spawnMiner(room, spawn);
		    } else if(transporters.length < 3) {
		        this.spawnTransporter(room, spawn);
		    } else if(builders.length < 2) {
		    	this.spawnBuilder(room, spawn);
		    } else if(upgraders.length < 2) {
		    	this.spawnUpgrader(room, spawn);
		    }			
			
			
			return b3.SUCCESS;
		},
		
		spawnHarvester: function(room, spawn) {
	        var newName = spawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
	        console.log('Spawning new harvester: ' + newName);
		},
		
		spawnMiner: function(room, spawn) {
			var newName = spawn.createCreep([WORK,WORK,MOVE], undefined, {role: 'miner'});
	        console.log('Spawning new miner: ' + newName);
		},
		
		spawnTransporter: function(room, spawn) {
			var newName = spawn.createCreep([MOVE,CARRY,MOVE,CARRY], undefined, {role: 'transporter'});
	        console.log('Spawning new transporter: ' + newName);
		},
		
		spawnBuilder: function(room, spawn) {
	        var newName = spawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
	        console.log('Spawning new builder: ' + newName);
		},
		
		spawnUpgrader: function(room, spawn) {
	        var newName = spawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
	        console.log('Spawning new upgrader: ' + newName);			
		}
		
	});
})();

(function() {
	"use strict";

	b3.CreateConstructionSites = b3.Class(b3.Action, {
		name: 'CreateConstructionSites',


		tick: function(tick) {
			var room = tick.target;

			return b3.SUCCESS;
		}
	});
})();

(function() {
	"use strict";
	b3.BuildDefault = b3.Class(b3.Action, {
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
})();

(function() {
	"use strict";
	b3.HarvestSource = b3.Class(b3.Action, {
		name: 'HarvestSource',


		tick: function(tick) {
			var creep = tick.target;
			//console.log("HarvestSource for creep: "+creep);

			if(creep.carryCapacity === 0 || creep.carry.energy < creep.carryCapacity) {
				var sources = creep.room.find(FIND_SOURCES);
				if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0]);
				}

				return b3.RUNNING;
			}

			return b3.SUCCESS;
		}
	});
})();

(function() {
	"use strict";

	b3.PickupEnergy = b3.Class(b3.Action, {
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
})();


(function() {
	"use strict";
	b3.RepairDefault = b3.Class(b3.Action, {
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
})();

(function() {
	"use strict";
	b3.TransferEnergy = b3.Class(b3.Action, {
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
})();

(function() {
	"use strict";
	b3.UpgradeController = b3.Class(b3.Action, {
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
})();

(function() {
	"use strict";
	b3.WithdrawEnergy = b3.Class(b3.Action, {
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
})();
