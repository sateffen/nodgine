
var routes              = [],
    url                 = require("url"),
    querystring         = require("querystring"),
    requestEncoding     = "utf-8",
    defaultController   = null;

/**
 * 
 * */
function ObjectToCallbackWrapper(callbackObject, request, response, args) {
    try {
        switch(request.method.toLowerCase()) {
        case "get":
            callbackObject.doGet(request,response, args);
            break;
        case "post":
            callbackObject.doPost(request,response, args);
            break;
        case "put":
            callbackObject.doPut(request,response, args);
            break;
        case "head":
            callbackObject.doHead(request,response, args);
            break;
        case "delete":
            callbackObject.doDelete(request,response, args);
            break;
        }
    }
    catch (e) {
        if (typeof defaultController == "function") {
            defaultController(request, response, args);
        }
        else {
            response.writeHead(404);
            response.end();
        }
    }
}

/**
 * Deletes all routes
 */
function clearRoutes() {
    "use strict";
    routes = [];
}


/**
 * Sets the default route controller for all not routeable requests
 * 
 * @param controller function
 */
function setDefaultRoute(controller) {
    "use strict";
    if (typeof controller === "function") {
        defaultController = controller;
    }
    else {
        throw "$ROUTER.setDefaultRoute first param needs to be a function as controller, got " + (typeof controller);
    }
}

/**
 * Returns the default route controller
 * 
 * @returns function || null
 */
function getDefaultRoute() {
    "use strict";
    return defaultController;
}

/**
 * This function generates a route object from given path
 * 
 * @param path            string
 * @param sensitive       bool
 * @returns object
 * 
 * inspired by expressjs (https://github.com/visionmedia/express/blob/master/lib/utils.js) pathRegexp
 */
function pathToRoute(path, sensitive) {
    "use strict";
    var tmpObj = {path: path, keys: []};
    path = path
        .concat('/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
            tmpObj.keys.push({ name: key, optional: !! optional });
            slash = slash || '';
            return '' +
                (optional ? '' : slash) +
                '(?:' +
                (optional ? slash : '') +
                (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' +
                (optional || '') +
                (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');
    tmpObj.regex = new RegExp('^' + path + '$', sensitive ? '' : 'i');
    return tmpObj;
}

/**
 * Adds a route to the router with controller as first url param, action as second url param and callback as handle
 * for the request
 * 
 * @param path                string
 * @param callback            function or object
 * @param caseSenesetive    bool | optional
 * 
 */
function addRoute(path, callback, caseSensetive) {
    "use strict";
    caseSensetive = caseSensetive || false;
    if (typeof path !== "string") {
        throw "$ROUTER.addRoute first param needs to be a string, got " + (typeof path);
    }
    if (typeof callback !== "function" && typeof callback !== "object") {
        throw "$ROUTER.addRoute second param needs to be a function, got " + (typeof path);
    }
    path = (path[0] === "/") ? path : "/" + path;

    var tmp = pathToRoute(path, caseSensetive);
    
    if (typeof callback == "object") {
        tmp.callbackData = callback;
        tmp.callback = ObjectToCallbackWrapper.bind(null, tmp.callbackData);
    }
    else {
        tmp.callback = callback;
    }
    routes.push(tmp);
}

/**
 * Returns the controller connected to a certain route. If the route wasn't defined it returns "undefined"
 * 
 * @param path    string
 * @returns object || undefined
 */
function getRoute(path) {
    "use strict";
    if (typeof path !== "string") {throw "no string"; }
    path = (path[0] === "/") ? path : "/" + path;
    for (var x in routes) {
        if (path.match(routes[x].regex) !== null) {
            return routes[x];
        }
    }
}

/**
 * Set the encoding for the request
 * 
 * @param encoding string
 */
function setEncoding(encoding) {
    "use strict";
    // TODO: test whether encoding is right
    requestEncoding = encoding || "utf-8";
}

/**
 * Returns the current encoding for requests
 * 
 * @returns string
 */
function getEncoding() {
    "use strict";
    return requestEncoding;
}


/**
 * This function is the routers core function. It gets the request from http or https server, and
 * routes it to the controller
 * 
 * @param request Object
 * @param response Object
 */
function route(request, response) {
    "use strict";
    var postData = "";
    
    request.setEncoding(requestEncoding);
    
    request.on("data", function(chunk) {
        postData += chunk;
    });
    
    request.on("end", function() {
        var urlParsed   = url.parse(request.url, true),
            path        = urlParsed.pathname,
            tmp         = null,
            x           = null;

        // set GPC
        request.get     = urlParsed.query;
        request.post    = querystring.parse(postData);
        request.cookie  = {};

        // analyse cookies
        var cookies = (request.headers.cookies) ? request.headers.cookie.split(';') : [];
        for (x in cookies) {
            tmp = cookies[x].split("=");
            request.cookie[tmp[0]] = tmp[1];
        }
        
        // find matching route
        for (x in routes) {
            tmp = path.match(routes[x].regex);
            if (tmp !== null) {
                var args = {};
                for (var y=0; y<routes[x].keys.length;y++) {
                    args[routes[x].keys[y].name] = tmp[y+1];
                }

                /*jshint -W083 */
                process.nextTick(function(){
                    routes[x].callback(request, response, args);
                });
                return;
            }
        }
        
        // if no route is defined, call default if exists
        if (typeof defaultController == "function") {
            defaultController(request, response, path);
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

// Create an object, that can be exported to the whole application, but cannot be modified
var EXPORTOBJECT = {};
Object.defineProperty(EXPORTOBJECT, "route", {
    value: route,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "addRoute", {
    value: addRoute,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "getRoute", {
    value: getRoute,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "setDefaultRoute", {
    value: setDefaultRoute,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "getDefaultRoute", {
    value: getDefaultRoute,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "setEncoding", {
    value: setEncoding,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "getEncoding", {
    value: getEncoding,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, "clearRoutes", {
    value: clearRoutes,
    writable: false
});

module.exports = EXPORTOBJECT;
