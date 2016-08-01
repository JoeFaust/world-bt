global.b3 = {};
var behavior = require('b3core.0.2.0');
var actions = require('b3_actions');
var conditions = require('b3_conditions');


var cleanMemory = require('clean.memory');
var constructorRoads = require('constructor.roads');

var creepTree = require('b3_tree_creep');
var roomTree = require('b3_tree_room');

var BlackboardScreeps = require('b3_blackboard_screeps');
var blackboard = new BlackboardScreeps();

module.exports.loop = function () {
    
	
	// Always place this memory cleaning code at the very top of your main loop!
	cleanMemory.run();
	
    if(Game.spawns.Spawn1.isActive) {
        //console.log('Spawn1 exists');
    } else {
        console.log('No spawn1');
        return
    }
    
    var room = Game.spawns.Spawn1.room;

    //var towers = _.filter(Game.structures, (structure) => structure.structureType == Game.STRUCTURE_TOWER);

    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

    if(towers.length > 1) {
        for(var tower in towers) {
            if(tower) {
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    tower.attack(closestHostile);
                }
                
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
        

            }
        }
    } else {
        //console.log("No towers found")
    }

    var treeId = creepTree.id;
    //console.log("treeId = "+treeId);
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepTree.id = treeId + "-" + creep.name;
        //console.log("Ticking tree for creep: "+creep.name+", creepTree.id: "+creepTree.id);
        creepTree.tick(creep, blackboard);
    }
    creepTree.id = treeId;
    
    var roomTreeId = roomTree.id;
    for(var roomName in Game.rooms) {
    	var room = Game.rooms[roomName];
    	roomTree.id = roomTreeId + "-" + room.name;
    	roomTree.tick(room, blackboard);
    }
    roomTree.id = roomTreeId;
    
    //constructorRoads.run(room);
    
}