/*
    The contents of this file are subject to the Mozilla Public License
    Version 1.1 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License at
    http://www.mozilla.org/MPL/

    Software distributed under the License is distributed on an "AS IS"
    basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
    License for the specific language governing rights and limitations
    under the License.

    The Original Code is OpenMobl Systems code.

    The Initial Developer of the Original Code is OpenMobl Systems.
    Portions created by OpenMobl Systems are Copyright (C) 2010-2011
    OpenMobl Systems. All Rights Reserved.

    Contributor(s):
        OpenMobl Systems
        Donald C. Kirker <donald.kirker@openmobl.com>

    Alternatively, the contents of this file may be used under the terms
    of the GNU General Public License Version 2 license (the  "GPL"), in
    which case the provisions of GPL License are applicable instead of
    those above. If you wish to allow use of your version of this file only
    under the terms of the GPL License and not to allow others to use
    your version of this file under the MPL, indicate your decision by
    deleting the provisions above and replace them with the notice and
    other provisions required by the GPL License. If you do not delete
    the provisions above, a recipient may use your version of this file
    under either the MPL or the GPL License.
 */

Transfer = {
    mainStageName: "picker",
    mainSceneName: "main",
    devicePickerSceneName: "devicepicker"
};

function AppAssistant()
{
    Mojo.Log.info("AppAssistant#new");
    
    this.stageController = null;
}

AppAssistant.prototype.setup = function()
{
    Mojo.Log.info("AppAssistant#setup");
};

/*
this.controller.serviceRequest("palm://com.palm.applicationManager",
                {
                    method: "open",
                    parameters: {
                        "id": "com.palm.app.btopp",
                        "params": {"target": file.fullPath}
                    }
                });
*/

AppAssistant.prototype.setupWatch = function()
{
/*
    this.oppNotificationService = this.controller.serviceRequest("palm://com.palm.bluetooth/opp", {
                                        method: "subscribenotifications",
                                        parameters: { "subscribe": true },
                                        onSuccess: this.oppNotify.bind(this),
                                        onFailure: function(failData){
                                            Mojo.Log.info("subscribenotifications, errCode: ", failData.errorCode);
                                        }                                                            
                                    });
*/
    /*
2017-11-24T09:37:25.201751Z [792] webos-device user.notice LunaSysMgr: {LunaSysMgrJS}: com.palm.app.btopp: Info: Launched with params:  {"action": "handleBtEvent", "$activity": {"activityId": 74, "callback": {"serial": 1675835109}, "creator": {"serviceId": "com.palm.app.btopp"}, "name": "btopp.btwatch", "trigger": {"error": 0, "file": "/tmp/IMG_20171122_055514.jpg", "notification": "notifnrecvstart", "type": "image/jpeg"}}}, palmInitFramework383:2569
2017-11-24T09:37:25.201812Z [792] webos-device user.notice LunaSysMgr: {LunaSysMgrJS}: com.palm.app.btopp: Info: handleBtEvent: {"activityId":74,"callback":{"serial":1675835109},"creator":{"serviceId":"com.palm.app.btopp"},"name":"btopp.btwatch","trigger":{"error":0,"file":"/tmp/IMG_20171122_055514.jpg","notification":"notifnrecvstart","type":"image/jpeg"}}, palmInitFramework383:2569

    */
};

AppAssistant.prototype.handleBtEvent = function(params)
{
    Mojo.Log.info("handleBtEvent: " + JSON.stringify(params));
/*
{"notification":"notifnrecvstart","file":"/tmp/IMG_20171122_055514.jpg","type":"image/jpeg","error":0}
{"notification":"notifnrecvprogress","progress":0}
{"notification":"notifnrecvcanceled"}
or
{"notification":"notifnrecvcomplete","progress":100,"error":0}

*/
};

AppAssistant.prototype.handleLaunch = function(params)
{
    Mojo.Log.info("AppAssistant#handleLaunch");
	/*
	This function is called after the application has launched by the user or
	the applicationManager service. This may be called while the app is already
	running.

	This function should handle any application-defined commands stored in the
	params field and launch the main stage, if necessary.
	*/

    Mojo.Log.info("Launched with params: ", Object.toJSON(params));

    if (params.target !== undefined) {
    
    } else if (params.action == "handleBtEvent" && params.$activity) {
        this.handleBtEvent(params.$activity);
    } else {
        var startup = function(stageController) {
            this.stageController = stageController;
            
            this.stageController.pushScene(Transfer.mainSceneName);
        }.bind(this);
        var stageArguments = {name: Transfer.mainStageName, lightweight: true};
        
        this.controller.createStageWithCallback(stageArguments, startup, Mojo.Controller.StageType.card);
    }
};

AppAssistant.prototype.handleCommand = function(event)
{
    //this.menuAssistant.handleCommand(event);
};

AppAssistant.prototype.cleanup = function()
{

};
