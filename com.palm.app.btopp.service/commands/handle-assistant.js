var HandleBtActivityAssistant = function() {
}

//

HandleBtActivityAssistant.prototype.setup = function() {  
}

HandleBtActivityAssistant.prototype.run = function(future) {
    logger.log("handleBtActivity: " + JSON.stringify(this.controller.args));
    //future.nest(complete(this.controller.args.$activity));
    
    var triggerEvent = this.controller.args.$activity.trigger;

    if (!triggerEvent || !triggerEvent.notification) {
        future.result = { returnValue: false, error: -1, errorText: "OPP state missing" };
    } else {
        switch (triggerEvent.notification) {
            case "notifnrecvstart": // {"error":0,"file":"/tmp/IMG_20171126_131016.jpg","notification":"notifnrecvstart","type":"image/jpeg"}
                future.nest(this.handleStart(triggerEvent));
                break;
            case "notifnrecvprogress": // {"notification":"notifnrecvprogress","progress":10}
                future.nest(this.handleProgress(triggerEvent));
                break;
            case "notifnrecvcanceled": // {"notification":"notifnrecvcanceled"}
                future.nest(this.handleCanceled(triggerEvent));
                break;
            default:
                future.result = { returnValue: false, error: -1, errorText: "Invalid OPP state" };
                break;
        }
    }
}
    
	/*future.nest(prefs.load());

	future.then(this, function(future) {
		var config = future.result;

		if(!this.controller.args.owner)
			future.result = { returnValue: false };	
		else if((!this.controller.args.key) && (!this.controller.args.keys))
			future.result = { returnValue: false };	
		else {
			var keys = [];
			
			if(this.controller.args.key)
				keys.push(this.controller.args.key);
			else
				keys = this.controller.args.keys;
			
			var result = { returnValue: true };
			
			for(var i = 0; i < keys.length; i++) {
				for(var category in config) {
					for(var group in config[category]) {
						for(var j = 0; j < config[category][group].length; j++) {
							if((config[category][group][j].owner == this.controller.args.owner) &&
								(config[category][group][j].key == keys[i]))
							{
								result[keys[i]] = config[category][group][j].value;
							}
						}
					}
				}
			}
			
			future.result = result;
		}
	});*/


HandleBtActivityAssistant.prototype.handleStart = function(triggerEvent) {
    var future = new Future();

    if (!triggerEvent.error) {
        future.nest(DBModels.btoppReceive.createActiveReceive(triggerEvent.file, triggerEvent.type));
    } else {
        future.result = { returnValue: false, error: triggeredEvent.error };
    }

    return future;
}

HandleBtActivityAssistant.prototype.handleProgress = function(triggerEvent) {
    var future = new Future();

    future.nest(DBModels.btoppReceive.getActiveReceive());

    future.then(this, function(future) {
        var activeReceive = future.result.returnValue ? future.result.result : undefined;
        
        if (activeReceive !== undefined) {
            if (triggerEvent.progress == 100 || triggerEvent.progress >= (activeReceive.progress + 5)) {
                future.nest(DBModels.btoppReceive.updateActiveReceive(activeReceive._id, triggerEvent.progress, DBModels.btoppReceive.states.RECEIVING));
            } else {
                future.result = { returnValue: true };
            }
            
            /*
            if progress == 100
            future.nest(use FileMgr service to move to /media/internal/downloads)
            future.then(this, function(future) {
                if no error
                    future.nest(MojoDB.merge(state: DBModels.btoppReceive.states.SAVED))
            })
            */
        } else {
            future.result = { returnValue: false, error: -1, errorText: "No active transfer" };
        }
    });

    return future;
}

HandleBtActivityAssistant.prototype.handleCanceled = function(triggerEvent) {
    var future = new Future();

    future.nest(DBModels.btoppReceive.getActiveReceive());

    future.then(this, function(future) {
        var activeReceive = future.result.returnValue ? future.result.result : undefined;
        
        if (activeReceive !== undefined) {
            future.nest(DBModels.btoppReceive.updateActiveReceive(activeReceive._id, activeReceive.progress, DBModels.btoppReceive.states.CANCELED));
        } else {
            future.result = { returnValue: false, error: -1, errorText: "No active transfer" };
        }
    });

    return future;
}

HandleBtActivityAssistant.prototype.complete = function(activity) {
    logger.log("HandleBtActivityAssistant:complete activity " + activity._activityId);
    var restartParams = {
        activityId: activity._activityId,
        restart: true,
        trigger: {
            method: "palm://com.palm.bluetooth/opps/subscribenotifications",
            params: {
                subscribe : true
            }
        },
        callback:{
            method: "palm://com.palm.app.btopp.service/handleBtActivity",
            params: { }
        }
    };
    return PalmCall.call(activity._service, "complete", restartParams);
}

HandleBtActivityAssistant.prototype.cleanup = function() {
}

