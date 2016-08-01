var actions = require('b3_actions');

var roomTree = new b3.BehaviorTree();

roomTree.root = new b3.Sequence(
		{children: [
		            new b3.MemSequence({
		            	children: [
		            	           new FrequencyCheck({
		            	        	   frequency: 10
		            	           }),
		            	           new b3.MemSequence({
		            	        	   children: [
		            	        	              new IdenfitySources()
		            	        	              ]
		            	           })
		            	           ]
		            }),
		            new b3.MemSequence({
		            	children: [
		            	           new DetermineRoomGoal(),
		            	           new SpawnCreeps(),
		            	           new CreateConstructionSites()
		            	           ]
		            })




		            ]});


module.exports = roomTree;