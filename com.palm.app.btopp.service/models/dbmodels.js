
/*
 * Copyright 2010 Palm, Inc.  All rights reserved.
 */

var DBModels = {};
DBModels.btoppReceive = {
	id: "com.palm.btopp.receivedlist:1",
    states: {
        RECEIVING: "receiving",
        CANCELED: "canceled",
        SAVED: "saved"
    },
	
    getReceiveList: function() {
		logger.log("DBModels.btoppReceive.getReceiveList");
		var future = new Future();

		future.nest(MojoDB.find({
			from: DBModels.btoppReceive.id	
		}));

		future.then(this, function(future) {
			logger.log("DBModels.btoppReceive.getReceiveList: get receive list " +  JSON.stringify(future.result));
			var results = future.result ? future.result.results : [];
			
			future.result = { results: results };
		});

        return future;
    },
    
	activeReceiveExists: function() {
		logger.log("DBModels.btoppReceive.activeReceiveExists");
		var future = new Future();

        future.nest(this.getActiveReceive());
        
        future.then(this, function(future) {
            var result = future.result ? future.result.returnValue : undefined;
            
            if (result !== undefined && result === true) {
                future.result = true;
            } else {
                future.result = false;
            }
        });
			
		return future;
	},
	
	createActiveReceive: function(path, mimeType) {
		logger.log("DBModels.btoppReceive.createActiveReceive");
		var future = new Foundations.Control.Future();
        var putObject = {
            "_kind": DBModels.btoppReceive.id,
            "progress": 0,
            "state": "receiving",
            "path": path,
            "mimeType": mimeType
        };

        future.nest(MojoDB.put([putObject]));

		future.then(this, function(future) {
			logger.log("Created active receive: " + JSON.stringify(future.result));
			future.result = true;
		});
		return future;
	},
	
	getActiveReceive: function() {
		logger.log("DBModels.btoppReceive.getActiveReceive");
		var future = new Future();

        future.nest(this.getReceiveList());
        
        future.then(this, function(future) {
            var results = future.result ? future.result.results : [];
            
            if (results !== undefined && results.length > 0 /*&& results[results.length - 1].state == DBModels.btoppReceive.states.RECEIVING*/) {
                var lastRecord = results[results.length - 1];
                
                future.result = { returnValue: true, result: lastRecord };
            } else {
                future.result = { returnValue: false, rerror: -1, errorText: "No record found" };
            }
        });
			
		return future;
	},
	
	updateActiveReceive: function(id, progress, state) {
        logger.log("DBModels.btoppReceive.updateActiveReceive");
		var future = new Foundations.Control.Future();
        var mergeObject = {
            objects: [{
                "progress": progress,
                "state": state,
                "_id": id
            }]
        };
        future.nest(MojoDB.execute("merge", mergeObject));

		future.then(this, function(future){
			logger.log("Saved active receive: " + JSON.stringify(future.result));
			future.result = true;
		});

		return future;
	}
};
