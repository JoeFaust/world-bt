function constructRoadOnPath(room, path) {
    for(var j = 0; j < path.length; j++) {
        var pathEntry = path[j];
        
        var result = room.createConstructionSite(pathEntry.x, pathEntry.y, STRUCTURE_ROAD);
        //console.log("Results on createConstructionSite for x: "+pathEntry.x+", y: "+pathEntry.y+" = "+result);
    }
	
}

function constructRoadBetween(room, startTarget, endTarget) {
	
	var startId = startTarget.id;
	var endId = endTarget.id;
	var pathKey = startId+"-"+endId;
	
	var path = null;
	if(!Memory.paths[pathKey]) {
		console.log("Finding path from "+startTarget+" to "+endTarget);
		path = room.findPath(startTarget.pos, endTarget.pos,  {maxOps: 2000, ignoreCreeps: true});
		Memory.paths[pathKey] = Room.serializePath(path);
	} else {
		path = Room.deserializePath(Memory.paths[pathKey]);
	}
	constructRoadOnPath(room, path);
	
}

var constructorRoads = {

	/** @param {Room} room **/
	run: function(room) {

		if(!Memory.paths) {
			Memory.paths = {};
		}
		
        if(Game.time % 100 == 0) {
            console.log("Build roads");

            console.log("Build road between spawn and controller");
            constructRoadBetween(room, Game.spawns.Spawn1, room.controller);

            console.log("Build road between spawn/controller and all sources");
            var sources = room.find(FIND_SOURCES);
            //console.log("sources.length: "+sources.length);
            if(sources.length) {
                for(i = 0; i < sources.length; i++) {
                    var source = sources[i];
                    constructRoadBetween(room, Game.spawns.Spawn1, source);
                    constructRoadBetween(room, room.controller, source);
                }
            }
        }   

    }
};

module.exports = constructorRoads;