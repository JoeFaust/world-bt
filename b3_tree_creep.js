
var creepTree = new b3.BehaviorTree();

creepTree.root = new b3.Priority(
		{children: [
		            new b3.MemSequence({
		            	children: [
		            	           new b3.RoleCheck({
		            	        	   role: 'harvester'
		            	           }),
		            	           new b3.MemSequence({
		            	        	   children: [
		            	        	              new b3.HarvestSource(),
		            	        	              new b3.TransferEnergy()
		            	        	              ]
		            	           })
		            	           ]
		            }),
		            new b3.MemSequence({
		            	children: [
		            	           new b3.RoleCheck({
		            	        	   role: 'miner'
		            	           }),
		            	           new b3.MemSequence({
		            	        	   children: [
		            	        	              new b3.HarvestSource(),
		            	        	              ]
		            	           })
		            	           ]
		            }),
		            new b3.MemSequence({
		            	children: [
		            	           new b3.RoleCheck({
		            	        	   role: 'transporter'
		            	           }),
		            	           new b3.MemSequence({
		            	        	   children: [
		            	        	              new b3.PickupEnergy(),
		            	        	              new b3.TransferEnergy()
		            	        	              ]
		            	           })
		            	           ]
		            }),
		            new b3.MemSequence({
		            	children: [
		            	           new b3.RoleCheck({
		            	        	   role: 'upgrader'
		            	           }),
		            	           new b3.MemSequence({
		            	        	   children: [
		            	        	              new b3.WithdrawEnergy(),
		            	        	              new b3.UpgradeController()
		            	        	              ]
		            	           })
		            	           ]
		            }),
		            new b3.MemSequence({
		            	children: [
		            	           new b3.RoleCheck({
		            	        	   role: 'builder'
		            	           }),
		            	           new b3.MemSequence({
		            	        	   children: [
		            	        	              new b3.WithdrawEnergy(),
		            	        	              new b3.MemPriority({
		            	        	            	  children: [
		       		            	        	              new b3.BuildDefault(),
		    		            	        	              new b3.RepairDefault()
		       		            	        	              ]
		            	        	              })
		            	        	              ]
		            	           })
		            	           ]
		            })
		            ]});

module.exports = creepTree;
