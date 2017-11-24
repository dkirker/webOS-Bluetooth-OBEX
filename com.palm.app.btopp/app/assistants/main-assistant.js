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

function MainAssistant()
{

}

MainAssistant.prototype.aboutToActivate = function(callback)
{
    callback.defer(); //makes the setup behave like it should.
};

MainAssistant.prototype.activate = function()
{

};

MainAssistant.prototype.setup = function()
{
    this.cmdMenuModel = {
        visible: true,
        items: [
            {},
            {
                icon: "send",
                command: "send"
            }
        ]
    };
    this.controller.setupWidget(Mojo.Menu.commandMenu, {}, this.cmdMenuModel);
};

MainAssistant.prototype.oppNotify = function(objData)
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

MainAssistant.prototype.launchFilePicker = function(that)
{
    var params = {
        kinds: ["image", "audio", "video", "file"],
        defaultKind: "image",
        onSelect: function(file) {
            var appArgs = {
                appId: "com.palm.app.bluetooth",
                name: "btopp"
            };
            var selectMsg = $L("1#Select a device to send the file to");
            var sendingMsg = $L("1#Sending file to #{name}...");
            var successMsg = $L("1#Send file complete");
            var errorMsg = $L("1#Unable to send file");
            var sceneArgs = {
                selectMsg: Mojo.Format.formatChoice(1, selectMsg, {name: "#{name}"}),
                sendingMsg: Mojo.Format.formatChoice(1, sendingMsg, {name: "#{name}"}),
                successMsg: Mojo.Format.formatChoice(1, successMsg, {name: "#{name}"}),
                errorMsg: Mojo.Format.formatChoice(1, errorMsg, {name: "#{name}"}),
                devicesToSearch: $L("Devices"),
                devicesToAdd: $L("Add device"),
                headerIconClass: '',
                headerIconPath: null,
                carkitsOnly: false,
                type: file.attachmentType,
                deleteWhenDone: false,
                file: file.fullPath
            };
            this.controller.stageController.popScene();
            this.controller.stageController.pushScene(appArgs, sceneArgs);
        }.bind(that)
    };
    Mojo.FilePicker.pickFile(params, this.controller.stageController); 
};

MainAssistant.prototype.cleanup = function(event)
{

};

MainAssistant.prototype.handleCommand = function(event)
{        
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case "send":
                this.launchFilePicker(this);
                return true;
            case Mojo.Menu.helpCmd:
                //this.sendCommandToApp({type:Mojo.Event.command, command:Mojo.Menu.helpCmd});
                return true;
        }
    }
};
