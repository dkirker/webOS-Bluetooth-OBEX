var Transport = IMPORTS["mojoservice.transport"];
var Foundations = IMPORTS["foundations"];
var Json = IMPORTS["foundations.json"];

var Class = Foundations.Class;
var Future = Foundations.Control.Future;
var MojoDB = Foundations.Data.MojoDB;
var PalmCall = Foundations.Comms.PalmCall;

if (typeof require === 'undefined') {
    require = IMPORTS.require;
}
  
var logger = require('pmloglib');



