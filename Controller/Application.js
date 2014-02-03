
var http    = require("http"),
    https   = require("https"),
    fs      = require("fs"),
    path    = require("path"),
    server  = {},
    classes = {};

function startHTTP(port) {
    "use strict";
    if (port < 1 || port > 65535) {
        throw "startHTTP: port out of range";
    }
    
    if (!server.http) {
        server.http = http.createServer($ROUTER.route);
    }
    
    server.http.listen(port);
}

function startHTTPS(key, cert, port, additionalOptions) {
    "use strict";
    if (port < 1 || port > 65535) {
        throw "startHTTPS: port out of range";
    }
    
    if (!server.https) {
        var options = {
            key: fs.readFileSync(key),
            cert: fs.readFileSync(cert)
        };
        for (var o in additionalOptions) {
            options[o] = additionalOptions[o];
        }
        server.https = https.createServer(options, $ROUTER.route);
    }
    
    server.https.listen(port);
}

function stopHTTP() {
    "use strict";
    if (server.http) {
        server.http.close();
    }
}

function stopHTTPS() {
    "use strict";
    if (server.https) {
        server.https.close();
    }
}

function run() {
    "use strict";
    EXPORTOBJECT.emit("startApplication");
}

function stop() {
    "use strict";
    EXPORTOBJECT.emit("stopApplication");
}

function getAllJSFiles(argBasePath) {
    "use strict";
    var returnFiles = [],
        dirList = null,
        files = null;
    files = fs.readdirSync(argBasePath);
    dirList = files.filter(function(file) {
        return fs.statSync(path.join(argBasePath, file)).isDirectory() && file[0] !== ".";
    });
    returnFiles = files.filter(function(file) {
        return fs.statSync(path.join(argBasePath, file)).isFile() && file.substr(-3) === ".js";
    });
    returnFiles = returnFiles.map(function(file){
        return path.join(argBasePath, file);
    });
    
    while (dirList.length > 0) {
        returnFiles = returnFiles.concat(getAllJSFiles(path.join(argBasePath, dirList.shift())));
    }
    
    return returnFiles;
}

function addLoadPath(argPath) {
    "use strict";
    argPath = path.resolve(argPath);
    var jsFiles = getAllJSFiles(argPath);
    var jsClassNames = jsFiles.map(function(file) {
        var tmp = file.substring(argPath.length, file.length-3);
        tmp = (tmp[0] === "/") ? tmp.substr(1) : tmp;
        tmp = tmp.replace(/\//g, "_");
        return tmp;
    });
    
    for (var i=0;i<jsFiles.length;i++) {
        classes[jsClassNames[i]] = jsFiles[i];
    }
}

function load(className) {
    "use strict";
    if (classes[className]) {
        return require(classes[className]);
    }
    return null;
}

function create(className, param) {
    "use strict";
    var Tmp = load(className);
    return new Tmp(param);
}

var EXPORTOBJECT = new (require("events").EventEmitter)();
Object.defineProperty(EXPORTOBJECT, "startHTTP", {
    value: startHTTP,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "startHTTPS", {
    value: startHTTPS,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "stopHTTP", {
    value: stopHTTP,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "stopHTTPS", {
    value: stopHTTPS,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "run", {
    value: run,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "stop", {
    value: stop,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "addLoadPath", {
    value: addLoadPath,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "create", {
    value: create,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "load", {
    value: load,
    writable: false
});


module.exports = EXPORTOBJECT;