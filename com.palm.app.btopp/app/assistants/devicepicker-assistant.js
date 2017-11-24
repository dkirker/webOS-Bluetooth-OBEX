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
        Palm, Inc.

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

function DevicepickerAssistant()
{

}

DevicepickerAssistant.prototype.aboutToActivate = function(callback)
{
    callback.defer(); //makes the setup behave like it should.
};

DevicepickerAssistant.prototype.activate = function()
{

};

DevicepickerAssistant.prototype.setup = function()
{
    this.oppNotificationService = this.controller.serviceRequest("palm://com.palm.bluetooth/opp", {
                                        method: "subscribenotifications",
                                        parameters: { "subscribe": true },
                                        onSuccess: this.oppNotify.bind(this),
                                        onFailure: function(failData){
                                            Mojo.Log.info("subscribenotifications, errCode: ", failData.errorCode);
                                        }                                                            
                                    });
};

DevicepickerAssistant.prototype.oppNotify = function(objData)
{
    var that = this; //used to scope this here.

    Mojo.Log.info("OPP notification: ", JSON.stringify(objData));
    this.instanceId = objData.instanceId;

    if (objData.returnValue)
        return;

    if (!objData.notification) {
        for(var key in objData) {
            if (key === "notification") {
                switch(objData.notification){
                    case "notifnpushprogress":
                        //this.notifyAssistants(Bluetooth.oppProgressPercent, payload.progress);
                        break;
                    case "notifnpushcomplete":
                        // Was there an error?
                        /*if (payload.error)
                            this.notifyAssistants(Bluetooth.oppError, payload.error);
                        else
                            this.notifyAssistants(Bluetooth.oppProgressPercent, payload.progress);*/
                        break;
                }
            }
        }
    }
};

DevicepickerAssistant.prototype.cleanup = function(event)
{

};

DevicepickerAssistant.prototype.handleCommand = function(event)
{        

};
