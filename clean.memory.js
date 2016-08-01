var cleanMemory = {

    run: function() {

        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                console.log('Clearing non-existing creep memory:', name);
                delete Memory.creeps[name];
                for(var treeId in Memory._treeMemory) {
                	if(treeId.endsWith(name)) {
                		console.log('Cleaning non-existing treeMemory:', treeId);
                		delete Memory._treeMemory[treeId];
                	}
                }
            }
        }
        
        for(var pathKey in Memory.paths) {
        	if(!pathKey.includes("-")) {
                console.log('Clearing invalid path memory:', pathKey);
        		delete Memory.paths[pathKey];
        		continue;
        	}
        	
        	var ids = pathKey.split("-");
        	if(ids.length != 2 || !Game.getObjectById(ids[0]) || !Game.getObjectById(ids[1])) {
                console.log('Clearing invalid path memory:', pathKey);
        		delete Memory.paths[pathKey];
        		continue;
        	}
        }

    }
};

module.exports = cleanMemory;