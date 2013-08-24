
/**
 * The REPL is currently not used
 */

var repl        = require("repl"),
    cmdList        = {};

/**
 * Evaluates the input of to REPL and executes the connected command
 * 
 * @param cmd
 * @param context
 * @param filename
 * @param callback
 */
function evalREPL(cmd, context, filename, callback) {
    "use strict";
    // prepare command
    cmd = cmd.substr(1, cmd.length-3).trim().toLowerCase();
    // test whether a real command got entered
    if (cmd.length === 0) { return; }
    // split off command and arguments
    var cmdParts = cmd.split(" "),
        // excluded to a variable to prevent the error detector of jshint
        nextTickFunction = function(){cmdList[x](cmdParts.slice(1), callback.bind(null, null));};
        
    // search for command and execute
    for (var x in cmdList) {
        if (x === cmdParts[0]) {
            process.nextTick(nextTickFunction);
            return;
        }
    }
    callback(null, "Unknown command");
}

/**
 * Adds a command to the list of known commands
 * 
 * @param command
 * @param callback
 */
function addCommand(command, callback) {
    "use strict";
    if (typeof command !== "string") {
        throw "$REPL.addCommand need a string as first param, got " + (typeof command);
    }
    if (typeof callback !== "function") {
        throw "$REPL.addCommand need a callable function as second param, got " + (typeof callback);
    }
    
    cmdList[command] = callback;
}

/**
 * Returns the function connected to a certain command
 * 
 * @param command
 * @returns function
 */
function getCommand(command) {
    "use strict";
    return cmdList[command];
}

// start the repl after all sync is started
process.nextTick(function(){
    repl.start({
        "prompt": "> ",
        "eval"  : evalREPL
    });
});

// Create an object to export
var EXPORTOBJECT = {};
Object.defineProperty(EXPORTOBJECT, "addCommand", {
    value: addCommand,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "getCommand", {
    value: getCommand,
    writable: false
});

module.exports = EXPORTOBJECT;