global.b3 = {};
var behavior = require('b3core.0.2.0');
var actions = require('b3_actions');
var conditions = require('b3_conditions');


var cleanMemory = require('clean.memory');
var constructorRoads = require('constructor.roads');

var creepTree = require('b3_tree_creep');

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

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);
    var upgraders =  _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('Upgraders: ' + upgraders.length);
    var builders =  _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('Builders: ' + builders.length);
    var miners =  _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    //console.log('Builders: ' + builders.length);
    var transporters =  _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
    //console.log('Builders: ' + builders.length);

    if(Object.keys(Game.creeps).length === 0) {
        var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    } else if(miners.length >= 1 && harvesters.length > 0) {
    	harvesters[0].memory.role = 'transporter';
    	console.log('Converting harvester to transporter');
    } else if(miners.length < 3) {
        var newName = Game.spawns.Spawn1.createCreep([WORK,WORK,MOVE], undefined, {role: 'miner'});
        console.log('Spawning new miner: ' + newName);
    } else if(transporters.length < 3) {
        var newName = Game.spawns.Spawn1.createCreep([MOVE,CARRY,MOVE,CARRY], undefined, {role: 'transporter'});
        console.log('Spawning new transporter: ' + newName);
    } else if(builders.length < 2) {
        var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    } else if(upgraders.length < 2) {
        var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }


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
    
    //constructorRoads.run(room);
    
}