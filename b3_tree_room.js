

var roomTree = new b3.BehaviorTree();

roomTree.root = new b3.Priority(
		{children: [
		            new b3.MemSequence({
		            	children: [
		            	           new b3.FrequencyCheck({
		            	        	   frequency: 10
		            	           }),
		            	           new b3.MemSequence({
		            	        	   children: [
		            	        	              new b3.IdenfitySources()
		            	        	              ]
		            	           })
		            	           ]
		            }),
		            new b3.MemSequence({
		            	children: [
		            	           new b3.DetermineRoomGoal(),
		            	           new b3.SpawnCreeps(),
		            	           new b3.CreateConstructionSites()
		            	           ]
		            })
		            ]});


module.exports = roomTree;