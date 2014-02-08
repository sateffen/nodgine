
var fs          = require("fs"),
    logFile     = "Log.txt",
    toFile      = false,
    toConsole   = true;

/**
 * This function generates a readable timestamp for the log
 * 
 * @returns string
 */
function getDateString() {
    "use strict";
    var d = new Date();
    return d.getDate() + "." +
        (d.getMonth()+1) + "." +
        d.getFullYear() + " " +
        d.getHours() + ":" + 
        ((d.getMinutes().toString().length>1) ? d.getMinutes() : "0" + d.getMinutes()) + ":" + 
        ((d.getSeconds().toString().length>1) ? d.getSeconds() : "0" + d.getSeconds());
}

/**
 * This is the general function which is connected to all incoming errors to work with them
 * 
 * @param state     string
 * @param critical  bool
 * @param message   string
 */
function enterLog(state, critical, message) {
    "use strict";
    if (typeof message!== "string") {
        throw "Logger needs a string as param, got " + (typeof message);
    }
    if (toFile) {
        fs.appendFileSync(logFile, "[" + state + "](" + getDateString() + ") "+ message + "\n", {encoding: "utf-8"});
    }
    if (toConsole) {
        console.log("[" + state + "](" + getDateString() + ") "+ message);
    }
    if (critical) {
        throw new Error("[" + state + "](" + getDateString() + ") "+ message);
    }
}

/**
 * With this function you can set the log file
 * 
 * @param filename  string
 */
function setLogFile(filename) {
    "use strict";
    logFile = filename;
}

/**
 * with this function you can set writing to file on or off
 * 
 * @param b bool
 */
function writeToFile(b) {
    "use strict";
    toFile = (b) ? true : false;
}

/**
 * with this function you can set writing to console on or off
 * 
 * @param b bool
 */
function writeToConsole(b) {
    "use strict";
    toConsole = (b) ? true : false;
}

var EXPORTOBJECT = {};
Object.defineProperty(EXPORTOBJECT, "error", {
    value: enterLog.bind(null, "ERROR", true),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "warning", {
    value: enterLog.bind(null, "WARNING", false),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "log", {
    value: enterLog.bind(null, "LOG", false),
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "setLogFile", {
    value: setLogFile,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "writeToFile", {
    value: writeToFile,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "writeToConsole", {
    value: writeToConsole,
    writable: false
});

module.exports = EXPORTOBJECT;