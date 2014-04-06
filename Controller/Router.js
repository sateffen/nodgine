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
     * A list of all preprocessors
     *
     * @private
     * @type {Array}
     **/
    mPreProcessors = [],

    /**
     * A list of all postprocessors
     *
     * @private
     * @type {Array}
     **/
    mPostProcessors = [],

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
     * A reference to the default controller
     *
     * @private
     * @type {function}
     **/
    mDefaultController = null,

    /**
     * A reference to the request object
     *
     * @private
     * @type {function}
     **/
    mRequestObject = require('./Classes/Request.js'),

    /**
     * A reference to the response object
     *
     * @private
     * @type {function}
     **/
    mResponseObject = require('./Classes/Response.js');

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
    // if the service method is available, call it
    if (typeof aCallbackObject.service === 'function') {
        aCallbackObject.service(aRequest, aResponse, aArgs);
        return;
    }
    // the service method is not available, so delegate the method to it's function
    else {
        // make the method to lowercase
        var method = aRequest.method.toLowerCase();
        // capitalize the method, so get goes Get, or post goes Post
        method = method.charAt(0).toUpperCase() + method.slice(1);
        // check whether method handler exists, like doGet or doPost. If yes, call it
        if (typeof aCallbackObject['do' + method] === 'function') {
            aCallbackObject['do' + method](aRequest, aResponse, aArgs);
            return;
        }
    }

    // the callback object wasn't able to answer the request, now the defaultcontroller has to do the job
    if (typeof mDefaultController === 'function') {
        mDefaultController(aRequest, aResponse, aArgs);
    }
    // but there is no default controller, so simply send 404
    else {
        aResponse.writeHead(404);
        aResponse.end();
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
    // delete routes
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
    // allocate some memory for the return object
    var tmpObj = {path: aPath, keys: []};
    // do some magic
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
    // convert the magic to a regexp
    tmpObj.regex = new RegExp('^' + aPath + '$', aSensetive ? '' : 'i');
    // return an object
    return tmpObj;
}

/**
 * Adds a route to the router with controller as first url param, action as second url param and callback as handle
 * for the request
 *
 * @method addRoute
 * @chainable
 * @param {string} aPath
 * @param {function | object} aCallback
 * @param {boolean} aCaseSensetive Optional, false by default
 * @return {object} The instance itself
 */
function mAddRoute(aPath, aCallback, aCaseSensetive) {
    'use strict';
    // preprocess arguments
    aCaseSensetive = !!aCaseSensetive;
    if (typeof aPath !== 'string') {
        throw '$ROUTER.addRoute: First param aPath needs to be a string, got ' + (typeof aPath);
    }
    if (typeof aCallback !== 'function' && typeof aCallback !== 'object') {
        throw '$ROUTER.addRoute: Second param aCallback needs to be a function, got ' + (typeof aCallback);
    }
    aPath = (aPath[0] === '/') ? aPath : '/' + aPath;

    // let some magic happen and save it
    var tmp = mPathToRoute(aPath, aCaseSensetive);

    // if the callback is an object, wrap it
    if (typeof aCallback === 'object') {
        tmp.callbackData = aCallback;
        tmp.callback = mObjectToCallbackWrapper.bind(null, tmp.callbackData);
    }
    // else it's a function, nothing to wrap
    else {
        tmp.callback = aCallback;
    }
    // push the route
    mRoutes.push(tmp);
    // make it chainable
    return EXPORTOBJECT;
}

/**
 * Adds a preprocessor to each request
 *
 * @method addPreProcessor
 * @chainable
 * @param {function} aPreProcessor
 * @return {object} The instance itself
 **/
function mAddPreProcessor(aPreProcessor) {
    'use strict';
    if (typeof aPreProcessor !== 'function') {
        throw '$ROUTER.addPreProcessor: First param aPreProcessor needs to be a function, got ' + (typeof aPreProcessor);
    }

    mPreProcessors.push(aPreProcessor);
    return EXPORTOBJECT;
}

/**
 * Adds a postprocessor to each request
 *
 * @method addPostProcessor
 * @chainable
 * @param {function} aPostProcessor
 * @return {object} The instance itself
 **/
function mAddPostProcessor(aPostProcessor) {
    'use strict';
    if (typeof aPostProcessor !== 'function') {
        throw '$ROUTER.addPreProcessor: First param aPreProcessor needs to be a function, got ' + (typeof aPostProcessor);
    }

    mPostProcessors.push(aPostProcessor);
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
    // preprocess arguments
    if (typeof aPath !== 'string') {
        throw '$ROUTER.getRoute: First param aPath needs to be a string, got ' + (typeof aPath);
    }
    aPath = (aPath[0] === '/') ? aPath : '/' + aPath;

    // go for every known route and check whether it's the searched one
    for (var x in mRoutes) {
        if (aPath.match(mRoutes[x].regex) !== null) {
            return mRoutes[x];
        }
    }
    // found null results
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
    // preprocess arguments
    if (typeof aCheckEncoding !== 'boolean') {
        aCheckEncoding = aCheckEncoding || true;
    }

    // define some encodings, that are Ok
    var possibleEncodings = ['utf8', 'ascii', 'binary', 'hex', 'base64', 'utf16le', 'ucs2'];
    // check encoding
    if (aCheckEncoding && possibleEncodings.indexOf(aEncoding.toLowerCase()) === -1) {
        throw '$ROUTER.setEncoding: Unknown encoding: ' + aEncoding;
    }
    // set encoding
    mRequestEncoding = aEncoding;
    // love encod... make it chainable!
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


//TODO: comment
function mExecutePreProcessors(aRequest, aResponse, aArgs, aCallback) {
    'use strict';
    var counter = 0;

    function callback(stop) {
        if (stop) {
            // if stop was called, the preprocessor has filtered out the request
            // if this is true, the response should be written to the client
            aResponse.nodgineEnd();
        }
        else {
            if (counter < mPreProcessors.length) {
                process.nextTick(function(c) {
                    mPreProcessors[c](aRequest, aResponse, aArgs, callback);
                }.bind(null, counter));
                counter++;
            }
            else {
                process.nextTick(function() {
                    aCallback(aRequest, aResponse, aArgs);
                });
            }
        }
    }

    callback();
}

//TODO: comment
function mExecutePostProcessors(aRequest, aResponse, aArgs, aCallback) {
    'use strict';
    var counter = 0;

    function callback() {
        if (counter < mPostProcessors.length) {
            process.nextTick(function(c) {
                mPostProcessors[c](aRequest, aResponse, aArgs, callback);
            }.bind(null, counter));
            counter++;
        }
        else {
            process.nextTick(function() {
                aResponse.nodgineEnd();
            });
        }
    }

    callback();
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
    // setup some memory
    var postData = '';

    // set the request encoding
    aRequest.setEncoding(mRequestEncoding);

    // save every chunk of data, that the request has
    aRequest.on('data', function(chunk) {
        postData += chunk;
    });

    // request finished, now process it
    aRequest.on('end', function() {
        var urlParsed   = mUrl.parse(aRequest.url, true),
            path        = urlParsed.pathname,
            tmp, x;

        // region set GPC
        // parse post
        // here the content-type is searched with indexOf, cause firefox sends an encoding in this header sometimes
        if (aRequest.headers['content-type'] && aRequest.headers['content-type'].toLowerCase().indexOf('application/json') > -1) {
            // try to parse it, baby
            try {
                aRequest.post = JSON.parse(postData);
            }
            // nope, the parser didn't like it
            catch(e) {
                aRequest.post = {};
            }
        }
        // not an application/json, so simply parse it like normal
        else {
            aRequest.post = mQuerystring.parse(postData);
        }

        // parse get, or better: it's allready parsed
        aRequest.get = urlParsed.query;

        // parse cookies
        aRequest.cookie = {};
        // receive cookies from headers
        var cookies = (aRequest.headers.cookie) ? aRequest.headers.cookie.split(';') : [];
        // now: do the cookie dance
        for (x in cookies) {
            if (cookies.hasOwnProperty(x) && typeof cookies[x] === 'string') {
                tmp = cookies[x].split('=');
                aRequest.cookie[tmp[0]] = tmp[1];
            }
        }
        // endregion

        // find matching route
        for (x in mRoutes) {
            if (mRoutes.hasOwnProperty(x) && typeof mRoutes[x] === 'object') {
                // check if it's the right route and store the result (for arguments)
                tmp = path.match(mRoutes[x].regex);
                // if tmp is null, this wasn't the right one
                if (tmp !== null) {
                    // allocate some memory
                    var args = {},
                        request = new mRequestObject(aRequest),
                        response = new mResponseObject(aResponse);
                    // play some memory
                    for (var y = 0; y < mRoutes[x].keys.length; y++) {
                        args[mRoutes[x].keys[y].name] = tmp[y+1];
                    }

                    // tell grandmother that memory sucks and go away
                    mExecutePreProcessors(request, response, args, mRoutes[x].callback);
                    response.registerResponseEndCallback(function() {
                        mExecutePostProcessors(request, response, args);
                    });

                    // found what I was searching for, so return
                    return;
                }
            }
        }
        
        // if no route is defined, call default one
        if (typeof mDefaultController === 'function') {
            mDefaultController(aRequest, aResponse, path);
        }
        // but there is no default one, so send 404
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
    'addPreProcessor': {
        value: mAddPreProcessor
    },
    'addPostProcessor': {
        value: mAddPostProcessor
    },
    'clearRoutes': {
        value: mClearRoutes
    }
});

module.exports = EXPORTOBJECT;
