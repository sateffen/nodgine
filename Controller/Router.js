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
    mRequestObject = require('./../Lib/Nodgine/Router/Request.js'),

    /**
     * A reference to the response object
     *
     * @private
     * @type {function}
     **/
    mResponseObject = require('./../Lib/Nodgine/Router/Response.js'),

    /**
     * A reference to the optimization interval object
     *
     * @private
     * @type {Interval}
     **/
    mOptimizeIntervalReference = 0;

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
    var tmpObj = {path: aPath, keys: [], requestCounter: 0};
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


/**
 * Executes all preprocessors on given request and response
 *
 * @private
 * @param {request} aRequest
 * @param {response} aResponse
 * @param {object} aArgs
 * @param {function} aCallback
 **/
function mExecutePreProcessors(aRequest, aResponse, aArgs, aCallback) {
    'use strict';
    // setup a counter, how many callbacks have been called
    var counter = 0;

    // the actual execution callback
    function callback(stop) {
        // if the callback was given an truish stop param, the request has been finished
        if (stop) {
            // so make the response end the request
            aResponse.nodgineEnd();
        }
        // the callback was called without finishing the request
        else {
            // if there are some preprocessors left over, do them
            if (counter < mPreProcessors.length) {
                // do the next preprocessor async
                process.nextTick(function(c) {
                    mPreProcessors[c](aRequest, aResponse, aArgs, callback);
                }.bind(null, counter));
                // next preprocessor has been started, so count up the counter
                counter++;
            }
            // no preprocessor left
            else {
                // call the callback, the actual requesthandler
                process.nextTick(function() {
                    aCallback(aRequest, aResponse, aArgs);
                });
            }
        }
    }

    // execute the first callback
    callback();
}


/**
 * Executes all postprocessors on given request and response
 *
 * @private
 * @param {request} aRequest
 * @param {response} aResponse
 * @param {object} aArgs
 **/
function mExecutePostProcessors(aRequest, aResponse, aArgs) {
    'use strict';
    // setup a postprocessor counter
    var counter = 0;

    // this is the actual post processor executer
    function callback() {
        // if there are some postprocessors left, execute them
        if (counter < mPostProcessors.length) {
            // execute the postprocessor async
            process.nextTick(function(c) {
                mPostProcessors[c](aRequest, aResponse, aArgs, callback);
            }.bind(null, counter));
            // next postprocessor has been started, so count up the counter
            counter++;
        }
        // no postprocessors left
        else {
            // finish the request
            aResponse.nodgineEnd();
        }
    }

    // execute the first postprocessor
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
        var urlParsed   = mUrl.parse(aRequest.url),
            path        = urlParsed.pathname,
            tmp, x;

        // region set GPC
        aRequest.post = postData;
        aRequest.get = urlParsed.search ;
        aRequest.cookie = aRequest.headers.cookie;
        // endregion

        // generate request and response object
        var request = new mRequestObject(aRequest),
            args = {},
            response = new mResponseObject(aResponse),
            routeToExecute = null;

        // find matching route
        for (x in mRoutes) {
            if (mRoutes.hasOwnProperty(x) && typeof mRoutes[x] === 'object') {
                // check if it's the right route and store the result (for arguments)
                tmp = path.match(mRoutes[x].regex);
                // if tmp is null, this wasn't the right one
                if (tmp !== null) {
                    // play some memory
                    for (var y = 0; y < mRoutes[x].keys.length; y++) {
                        args[mRoutes[x].keys[y].name] = tmp[y+1];
                    }

                    // increment request counter
                    mRoutes[x].requestCounter++;

                    // found route, set route
                    routeToExecute = mRoutes[x].callback;

                    // found what I was searching for, so return
                    break;
                }
            }
        }
        
        // if no route is found
        if (routeToExecute === null) {
            // if defaultcontroller is set
            routeToExecute = (typeof mDefaultController === 'function') ?
                // set defaultcontroller
                mDefaultController :
                // else define a defaultcontroller
                function () {
                    aResponse.writeHead(404);
                    aResponse.end();
                };
        }

        mExecutePreProcessors(request, response, args, routeToExecute);
        response.nodgineResponseEndCallback(function() {
            mExecutePostProcessors(request, response, args);
        });
    });
}

/**
 * Sorting the route objects descending
 *
 * @private
 * @param {Route-Object} aFirst
 * @param {Route-Object} aSecond
 * @returns {Number}
 **/
function mSortRoutes(aFirst, aSecond) {
    'use strict';
    // sort descend
    return aSecond.requestCounter - aFirst.requestCounter;
}

/**
 * Opimizes the mRoutes array
 *
 * @private
 **/
function mOptimizeRoutes() {
    'use strict';

    // sort descending
    mRoutes.sort(mSortRoutes);

    // reset all requestcounter
    for (var i = 0; i < mRoutes.length; i++) {
        mRoutes[i].requestCounter = 0;
    }
}

/**
 * Sets or unsets an optimization interval (0 = unset, larger than 0 the time in milliseconds between the executions)
 *
 * @method setOptimizeInterval
 * @param {Number} aIntervalTime
 * @return {Object}
 **/
function mSetOptimizeInterval(aIntervalTime) {
    'use strict';

    // reset current interval
    clearInterval(mOptimizeIntervalReference);

    // if intervaltime is larger than 0, it should be set
    if (aIntervalTime > 0) {
        // set new interval
        mOptimizeIntervalReference = setInterval(mOptimizeRoutes, aIntervalTime);
    }

    return EXPORTOBJECT;
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
    },
    'setOptimizeInterval': {
        value: mSetOptimizeInterval
    }
});

module.exports = EXPORTOBJECT;
