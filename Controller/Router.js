/**
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
    mRoutes = [],

    /**
     * A reference to the url-module
     *
     * @private
     * @type {url}
     **/
    mUrl = require('url'),

    /**
     * A reference to the querystring-module
     *
     * @private
     * @type {querystring}
     **/
    mQuerystring = require('querystring'),

    /**
     * The requestencoding
     *
     * @private
     * @type {string}
     * @default 'utf8'
     **/
    mRequestEncoding = 'utf8',

    /**
     * A reference to the default function
     *
     * @private
     * @type {function}
     **/
    mDefaultController = null;

/**
 * Wrappes an object to a callable function
 *
 * @private
 * @param {object} aCallbackObject The object, which should be wrapped
 * @param {request} aRequest An nodejs request-object
 * @param {response} aResponse An nodejs response object
 * @param {object} aArgs Arguments, given by called url
 **/
function mObjectToCallbackWrapper(aCallbackObject, aRequest, aResponse, aArgs) {
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
        if (typeof mDefaultController === 'function') {
            mDefaultController(aRequest, aResponse, aArgs);
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
function mClearRoutes() {
    'use strict';
    mRoutes = [];
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
function mSetDefaultRoute(aController) {
    'use strict';
    if (typeof aController === 'function') {
        mDefaultController = aController;
    }
    else {
        throw '$ROUTER.setDefaultRoute: First param aController needs to be a function as controller, got ' + (typeof aController);
    }
    return EXPORTOBJECT;
}

/**
 * Returns the default route controller
 *
 * @method getDefaultRoute
 * @return {function | null}
 */
function mGetDefaultRoute() {
    'use strict';
    return mDefaultController;
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
function mPathToRoute(aPath, aSensetive) {
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
 * @param {string} aPath
 * @param {function | object} aCallback
 * @param {boolean} aCaseSensetive Optional, false by default
 * 
 */
function mAddRoute(aPath, aCallback, aCaseSensetive) {
    'use strict';
    aCaseSensetive = aCaseSensetive || false;
    if (typeof aPath !== 'string') {
        throw '$ROUTER.addRoute: First param aPath needs to be a string, got ' + (typeof aPath);
    }
    if (typeof aCallback !== 'function' && typeof aCallback !== 'object') {
        throw '$ROUTER.addRoute: Second param aCallback needs to be a function, got ' + (typeof aCallback);
    }
    aPath = (aPath[0] === '/') ? aPath : '/' + aPath;

    var tmp = mPathToRoute(aPath, aCaseSensetive);
    
    if (typeof aCallback === 'object') {
        tmp.callbackData = aCallback;
        tmp.callback = mObjectToCallbackWrapper.bind(null, tmp.callbackData);
    }
    else {
        tmp.callback = aCallback;
    }
    mRoutes.push(tmp);
    return EXPORTOBJECT;
}

/**
 * Returns the controller connected to a certain route. If the route wasn't defined it returns 'undefined'
 *
 * @method getRoute
 * @param {string} aPath
 * @return {object | null}
 */
function mGetRoute(aPath) {
    'use strict';
    if (typeof aPath !== 'string') {
        throw '$ROUTER.getRoute: First param aPath needs to be a string, got ' + (typeof aPath);
    }
    aPath = (aPath[0] === '/') ? aPath : '/' + aPath;
    for (var x in mRoutes) {
        if (aPath.match(mRoutes[x].regex) !== null) {
            return mRoutes[x];
        }
    }
    return null;
}

/**
 * Set the encoding for the request. If aCheckEncoding is set, the encoding gets validated. Valid encodings are
 * utf8, ascii, binary, hex, base64, utf16le and ucs2
 *
 * @method setEncoding
 * @param {string} aEncoding The encoding string
 * @param {boolean} aCheckEncoding Whether to check, if encoding is ok or not
 */
function mSetEncoding(aEncoding, aCheckEncoding) {
    'use strict';
    if (typeof aCheckEncoding !== 'boolean') {
        aCheckEncoding = aCheckEncoding || true;
    }

    var possibleEncodings = ['utf8', 'ascii', 'binary', 'hex', 'base64', 'utf16le', 'ucs2'];
    if (aCheckEncoding && possibleEncodings.indexOf(aEncoding.toLowerCase()) === -1) {
        throw '$ROUTER.setEncoding: Unknown encoding: ' + aEncoding;
    }
    mRequestEncoding = aEncoding;
    return EXPORTOBJECT;
}

/**
 * Returns the current encoding for requests
 *
 * @method getEncoding
 * @return {string}
 */
function mGetEncoding() {
    'use strict';
    return mRequestEncoding;
}


/**
 * This function is the routers core function. It gets the request from http or https server, and routes it to the
 * controller
 *
 * @method route
 * @param {request} aRequest An nodejs request
 * @param {response} aResponse An nodejs response
 */
function mRoute(aRequest, aResponse) {
    'use strict';
    var postData = '';
    
    aRequest.setEncoding(mRequestEncoding);
    
    aRequest.on('data', function(chunk) {
        postData += chunk;
    });
    
    aRequest.on('end', function() {
        var urlParsed   = mUrl.parse(aRequest.url, true),
            path        = urlParsed.pathname,
            tmp, x;

        // region set GPC
        // parse post
        if (aRequest.headers['content-type'] && aRequest.headers['content-type'].toLowerCase().indexOf('application/json') > -1) {
            try {
                aRequest.post = JSON.parse(postData);
            }
            catch(e) {
                aRequest.post = {};
            }
        }
        else {
            aRequest.post = mQuerystring.parse(postData);
        }

        // parse get
        aRequest.get = urlParsed.query;

        // parse cookies
        aRequest.cookie = {};
        var cookies = (aRequest.headers.cookie) ? aRequest.headers.cookie.split(';') : [];
        for (x in cookies) {
            if (typeof cookies[x] === 'string') {
                tmp = cookies[x].split('=');
                aRequest.cookie[tmp[0]] = tmp[1];
            }
        }
        // endregion
        
        // find matching route
        for (x in mRoutes) {
            if (typeof mRoutes[x] === 'object') {
                tmp = path.match(mRoutes[x].regex);
                if (tmp !== null) {
                    var args = {};
                    for (var y = 0; y < mRoutes[x].keys.length; y++) {
                        args[mRoutes[x].keys[y].name] = tmp[y+1];
                    }

                    process.nextTick(function(aX, aArgs) {
                        mRoutes[aX].callback(aRequest, aResponse, aArgs);
                    }.bind(null, x, args));
                    return;
                }
            }
        }
        
        // if no route is defined, call default if exists
        if (typeof mDefaultController === 'function') {
            mDefaultController(aRequest, aResponse, path);
        }
        else {
            aResponse.writeHead(404);
            aResponse.end();
        }
    });
}

// extend EXPORTOBJECT with all properties to reveal
Object.defineProperties(EXPORTOBJECT, {
    'route': {
        value: mRoute
    },
    'addRoute': {
        value: mAddRoute
    },
    'getRoute': {
        value: mGetRoute
    },
    'setDefaultRoute': {
        value: mSetDefaultRoute
    },
    'getDefaultRoute': {
        value: mGetDefaultRoute
    },
    'setEncoding': {
        value: mSetEncoding
    },
    'getEncoding': {
        value: mGetEncoding
    },
    'clearRoutes': {
        value: mClearRoutes
    }
});

module.exports = EXPORTOBJECT;
