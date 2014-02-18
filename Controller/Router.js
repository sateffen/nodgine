/**
 * @TODO: Rework all comments for YUIDOC
 * This is the Router API for the nodgine module
 *
 * @module nodgine
 * @submodule $ROUTER
 * @class $ROUTER
 * @static
 **/

/**
 * The exporting object, which gets revealed
 *
 * @type {object}
 **/
var EXPORTOBJECT = {},

    /**
     * A list of all routes
     *
     * @private
     * @type {Array}
     **/
    routes = [],

    /**
     * A reference to the url-module
     *
     * @private
     * @type {url}
     **/
    url = require('url'),

    /**
     * A reference to the querystring-module
     *
     * @private
     * @type {querystring}
     **/
    querystring = require('querystring'),

    /**
     * The requestencoding
     *
     * @private
     * @type {string}
     * @default 'utf-8'
     **/
    requestEncoding = 'utf-8',

    /**
     * A reference to the default function
     *
     * @private
     * @type {function}
     **/
    defaultController = null;


function ObjectToCallbackWrapper(aCallbackObject, aRequest, aResponse, aArgs) {
    'use strict';
    try {
        switch(aRequest.method.toLowerCase()) {
        case 'get':
            aCallbackObject.doGet(aRequest, aResponse, aArgs);
            break;
        case 'post':
            aCallbackObject.doPost(aRequest, aResponse, aArgs);
            break;
        case 'put':
            aCallbackObject.doPut(aRequest, aResponse, aArgs);
            break;
        case 'head':
            aCallbackObject.doHead(aRequest, aResponse, aArgs);
            break;
        case 'delete':
            aCallbackObject.doDelete(aRequest, aResponse, aArgs);
            break;
        }
    }
    catch (e) {
        if (typeof defaultController === 'function') {
            defaultController(aRequest, aResponse, aArgs);
        }
        else {
            aResponse.writeHead(404);
            aResponse.end();
        }
    }
}

/**
 * Deletes all routes
 *
 * @chainable
 * @method clearRoutes
 * @return {object} The instance itself
 */
function clearRoutes() {
    'use strict';
    routes = [];
    return EXPORTOBJECT;
}

/**
 * Sets the default route controller for all not routeable requests
 *
 * @chainable
 * @method setDefaultRoute
 * @param {function} aController
 * @return {object} The instance itself
 */
function setDefaultRoute(aController) {
    'use strict';
    if (typeof aController === 'function') {
        defaultController = aController;
    }
    else {
        throw '$ROUTER.setDefaultRoute first param needs to be a function as controller, got ' + (typeof aController);
    }
    return EXPORTOBJECT;
}

/**
 * Returns the default route controller
 *
 * @method getDefaultRoute
 * @return {function || null}
 */
function getDefaultRoute() {
    'use strict';
    return defaultController;
}

/**
 * This function generates a route object from given path
 *
 * @private
 * @param {string} aPath
 * @param {boolean} aSensetive
 * @return {object}
 * 
 * inspired by expressjs (https://github.com/visionmedia/express/blob/master/lib/utils.js) pathRegexp
 */
function pathToRoute(aPath, aSensetive) {
    'use strict';
    var tmpObj = {path: aPath, keys: []};
    aPath = aPath
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
    tmpObj.regex = new RegExp('^' + aPath + '$', aSensetive ? '' : 'i');
    return tmpObj;
}

/**
 * Adds a route to the router with controller as first url param, action as second url param and callback as handle
 * for the request
 *
 * @method addRoute
 * @param aPath                string
 * @param aCallback            function or object
 * @param aCaseSensetive    bool | optional
 * 
 */
function addRoute(aPath, aCallback, aCaseSensetive) {
    'use strict';
    aCaseSensetive = aCaseSensetive || false;
    if (typeof aPath !== 'string') {
        throw '$ROUTER.addRoute first param needs to be a string, got ' + (typeof aPath);
    }
    if (typeof aCallback !== 'function' && typeof aCallback !== 'object') {
        throw '$ROUTER.addRoute second param needs to be a function, got ' + (typeof aPath);
    }
    aPath = (aPath[0] === '/') ? aPath : '/' + aPath;

    var tmp = pathToRoute(aPath, aCaseSensetive);
    
    if (typeof aCallback === 'object') {
        tmp.callbackData = aCallback;
        tmp.callback = ObjectToCallbackWrapper.bind(null, tmp.callbackData);
    }
    else {
        tmp.callback = aCallback;
    }
    routes.push(tmp);
    return EXPORTOBJECT;
}

/**
 * Returns the controller connected to a certain route. If the route wasn't defined it returns 'undefined'
 *
 * @method getRoute
 * @param aPath    string
 * @returns object || null
 */
function getRoute(aPath) {
    'use strict';
    if (typeof aPath !== 'string') {throw 'no string'; }
    aPath = (aPath[0] === '/') ? aPath : '/' + aPath;
    for (var x in routes) {
        if (aPath.match(routes[x].regex) !== null) {
            return routes[x];
        }
    }
    return null;
}

/**
 * Set the encoding for the request
 *
 * @method setEncoding
 * @param aEncoding string
 */
function setEncoding(aEncoding) {
    'use strict';
    // TODO: test whether encoding is right
    requestEncoding = aEncoding || 'utf-8';
    return EXPORTOBJECT;
}

/**
 * Returns the current encoding for requests
 *
 * @method getEncoding
 * @returns string
 */
function getEncoding() {
    'use strict';
    return requestEncoding;
}


/**
 * This function is the routers core function. It gets the request from http or https server, and
 * routes it to the controller
 *
 * @method route
 * @param aRequest Object
 * @param aResponse Object
 */
function route(aRequest, aResponse) {
    'use strict';
    var postData = '';
    
    aRequest.setEncoding(requestEncoding);
    
    aRequest.on('data', function(chunk) {
        postData += chunk;
    });
    
    aRequest.on('end', function() {
        var urlParsed   = url.parse(aRequest.url, true),
            path        = urlParsed.pathname,
            tmp, x;

        // set GPC
        aRequest.get     = urlParsed.query;
        aRequest.post    = querystring.parse(postData);
        aRequest.cookie  = {};

        // analyse cookies
        var cookies = (aRequest.headers.cookie) ? aRequest.headers.cookie.split(';') : [];
        for (x in cookies) {
            if (typeof cookies[x] === 'string') {
                tmp = cookies[x].split('=');
                aRequest.cookie[tmp[0]] = tmp[1];
            }
        }
        
        // find matching route
        for (x in routes) {
            if (typeof routes[x] === 'object') {
                tmp = path.match(routes[x].regex);
                if (tmp !== null) {
                    var args = {};
                    for (var y = 0; y < routes[x].keys.length; y++) {
                        args[routes[x].keys[y].name] = tmp[y+1];
                    }

                    process.nextTick(function(aX, aArgs) {
                        routes[aX].callback(aRequest, aResponse, aArgs);
                    }.bind(null, x, args));
                    return;
                }
            }
        }
        
        // if no route is defined, call default if exists
        if (typeof defaultController === 'function') {
            defaultController(aRequest, aResponse, path);
        }
        else {
            aResponse.writeHead(404);
            aResponse.end();
        }
    });
}

Object.defineProperty(EXPORTOBJECT, 'route', {
    value: route,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'addRoute', {
    value: addRoute,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'getRoute', {
    value: getRoute,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'setDefaultRoute', {
    value: setDefaultRoute,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'getDefaultRoute', {
    value: getDefaultRoute,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'setEncoding', {
    value: setEncoding,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'getEncoding', {
    value: getEncoding,
    writable: false
});
Object.defineProperty(EXPORTOBJECT, 'clearRoutes', {
    value: clearRoutes,
    writable: false
});

module.exports = EXPORTOBJECT;
