
var http    = require("http"),
    https   = require("https"),
    fs      = require("fs"),
    server  = {};

function startHTTP(port) {
    if (port < 1 && port > 65535) {
        throw "wrong port";
    }
    
    if (!server.http) {
        server.http = http.createServer($ROUTER.route);
    }
    
    server.http.listen(port);
}

function startHTTPS(key, cert, port) {
    if (port < 1 && port > 65535) {
        throw "wrong port";
    }
    
    if (!server.https) {
        var options = {
            key: fs.readFileSync(key),
            cert: fs.readFileSync(cert)
        };
        server.https = https.createServer(options, $ROUTER.route);
    }
    
    server.https.listen(port);
}

function stopHTTP() {
    if (server.http) {
        server.http.close();
    }
}

function stopHTTPS() {
    if (server.https) {
        server.https.close();
    }
}

function run() {
    EXPORTOBJECT.emit("startApplication");
}

function stop() {
    EXPORTOBJECT.emit("stopApplication");
}

var EXPORTOBJECT = new require("events").EventEmitter();
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

Object.preventExtensions(EXPORTOBJECT);
module.exports = EXPORTOBJECT;
