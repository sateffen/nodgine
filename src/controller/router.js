/**
 * This is the Router API for the nodgine module
 *
 * @module $ROUTER
 **/
'use strict';
/**
 * The exporting object, which gets revealed
 *
 * @private
 * @type {$ROUTER}
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
     * The request-encoding
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
     * @type {null|function}
     **/
    mDefaultController = null,

    /**
     * A reference to the request object
     *
     * @private
     * @type {function}
     **/
    mRequestObject = require('../lib/nodgine/router/request.js'),

    /**
     * A reference to the response object
     *
     * @private
     * @type {function}
     **/
    mResponseObject = require('../lib/nodgine/router/response.js'),

    /**
     * A reference to the optimization interval object
     *
     * @private
     * @type {Interval}
     **/
    mOptimizeIntervalReference = 0;

/**
 * Wraps an object to a callable function
 *
 * @private
 * @param {object} aCallbackObject - The object, which should be wrapped
 * @param {request} aRequest - An nodejs request-object
 * @param {response} aResponse - An nodejs response object
 * @param {object} aArgs - Arguments, given by called url
 * @return {undefined} Nothing
 **/
function mObjectToCallbackWrapper(aCallbackObject, aRequest, aResponse, aArgs) {
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
 * @method clearRoutes
 * @static
 * @return {$ROUTER} The instance itself
 */
function mClearRoutes() {
    // delete routes
    mRoutes = [];
    return EXPORTOBJECT;
}

/**
 * Sets the default route controller for all not routeable requests. This has to be a function,
 * that handles all requests and request methods, that are not routable.
 *
 * @method setDefaultRoute
 * @static
 * @param {function} aController
 * @return {$ROUTER} The instance itself
 */
function mSetDefaultRoute(aController) {
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
 * @static
 * @return {function|null}
 */
function mGetDefaultRoute() {
    return mDefaultController;
}

/**
 * This function generates a route object from given path
 *
 * @private
 * @param {string} aPath
 * @param {boolean} aSensitive
 * @return {object}
 *
 * inspired by expressjs (https://github.com/visionmedia/express/blob/master/lib/utils.js) pathRegexp
 */
function mPathToRoute(aPath, aSensitive) {
    // allocate some memory for the return object
    var tmpObj = {path: aPath, keys: [], requestCounter: 0};
    // do some magic
    aPath = aPath
        .concat('/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, key, capture, optional, star) {
            tmpObj.keys.push({name: key, optional: !!optional});
            slash = slash || '';
            return '' +
                (optional ? '' : slash) +
                '(?:' +
                (optional ? slash : '') +
                (capture || '([^/]+?)') + ')' +
                (optional || '') +
                (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, function() {
            tmpObj.keys.push({name: '*', optional: true});
            return '?(.*)';
        })
        .replace(/[\\\/]{2,}/g, '\/');
    // convert the magic to a regexp
    tmpObj.regex = new RegExp('^' + aPath + '$', aSensitive ? '' : 'i');
    // return an object
    return tmpObj;
}

/**
 * Adds a route to the router with controller as first url param, action as second url param and callback as handle
 * for the request
 *
 * @method addRoute
 * @static
 * @param {string} aPath
 * @param {function|object} aCallback
 * @param {boolean} [aCaseSensitive=false] - Optional, false by default
 * @return {$ROUTER} The instance itself
 */
function mAddRoute(aPath, aCallback, aCaseSensitive) {
    // preprocess arguments
    aCaseSensitive = !!aCaseSensitive;
    if (typeof aPath !== 'string') {
        throw '$ROUTER.addRoute: First param aPath needs to be a string, got ' + (typeof aPath);
    }
    if (typeof aCallback !== 'function' && typeof aCallback !== 'object' || aCallback === null || Array.isArray(aCallback)) {
        throw '$ROUTER.addRoute: Second param aCallback needs to be a function or object (not array), got ' + (typeof aCallback);
    }

    aPath = (aPath[0] === '/') ? aPath : '/' + aPath;

    // let some magic happen and save it
    var tmp = mPathToRoute(aPath, aCaseSensitive);

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
 * @static
 * @param {function} aPreProcessor
 * @return {$ROUTER} The instance itself
 **/
function mAddPreProcessor(aRoute, aPreProcessor) {
    if (typeof aRoute === 'function') {
        mPreProcessors.push({
            regex: null,
            processor: aRoute
        });
    }
    else if (typeof aRoute === 'string' && typeof aPreProcessor === 'function') {
        var routeObject = mPathToRoute(aRoute);
        mPreProcessors.push({
            regex: routeObject.regex,
            path: routeObject.path,
            keys: routeObject.keys,
            processor: aPreProcessor
        });
    }
    else {
        if (aPreProcessor === undefined) {
            throw '$ROUTER.addPreProcessor: First param needs to be a function, got ' + (typeof aRoute);
        }
        else {
            throw '$ROUTER.addPreProcessor: First param needs to be a string, second a function';
        }
    }

    return EXPORTOBJECT;
}

/**
 * Adds a postprocessor to each request
 *
 * @method addPostProcessor
 * @static
 * @param {function} aPostProcessor
 * @return {$ROUTER} The instance itself
 **/
function mAddPostProcessor(aRoute, aPostProcessor) {
    if (typeof aRoute === 'function') {
        mPostProcessors.push({
            regex: null,
            processor: aRoute
        });
    }
    else if (typeof aRoute === 'string' && typeof aPostProcessor === 'function') {
        var routeObject = mPathToRoute(aRoute);
        mPostProcessors.push({
            regex: routeObject.regex,
            path: routeObject.path,
            keys: routeObject.keys,
            processor: aPostProcessor
        });
    }
    else {
        if (aPostProcessor === undefined) {
            throw '$ROUTER.aPostProcessor: First param needs to be a function, got ' + (typeof aRoute);
        }
        else {
            throw '$ROUTER.aPostProcessor: First param needs to be a string, second a function';
        }
    }
    return EXPORTOBJECT;
}

/**
 * Returns the controller connected to a certain route. If the route wasn't defined it returns 'undefined'
 *
 * @method getRoute
 * @static
 * @param {string} aPath
 * @return {object|null}
 */
function mGetRoute(aPath) {
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
 * @deprecated
 * @static
 * @param {string} aEncoding - The encoding string
 * @param {boolean} [aCheckEncoding=true] - Whether to check, if encoding is ok or not
 * @return {undefined} Nothing
 */
function mSetEncoding(aEncoding, aCheckEncoding) {
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
 * @static
 * @deprecated
 * @return {string}
 */
function mGetEncoding() {
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
                    if (mPreProcessors[c].regex === null) {
                        mPreProcessors[c].processor(aRequest, aResponse, aArgs, callback);
                    }
                    else {
                        var urlParsed = mUrl.parse(aRequest.url),
                            path = urlParsed.pathname,
                            matched = path.match(mPreProcessors[c].regex);
                        
                        if (matched !== null) {
                            mPreProcessors[c].processor(aRequest, aResponse, aArgs, callback);
                        }
                        else {
                            callback();
                        }
                    }
                }.bind(null, counter));
                // next preprocessor has been started, so count up the counter
                ++counter;
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
    // setup a postprocessor counter
    var counter = 0;

    // this is the actual post processor executer
    function callback() {
        // if there are some postprocessors left, execute them
        if (counter < mPostProcessors.length) {
            // execute the postprocessor async
            process.nextTick(function(c) {
                if (mPostProcessors[c].regex === null) {
                    mPostProcessors[c].processor(aRequest, aResponse, aArgs, callback);
                }
                else {
                    var urlParsed = mUrl.parse(aRequest.url),
                        path = urlParsed.pathname,
                        matched = path.match(mPostProcessors[c].regex);
                    
                    if (matched !== null) {
                        mPostProcessors[c].processor(aRequest, aResponse, aArgs, callback);
                    }
                    else {
                        callback();
                    }
                }
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
 * @inner
 * @param {request} aRequest - An nodejs request
 * @param {response} aResponse - An nodejs response
 */
function mRoute(aRequest, aResponse) {
    // setup some memory
    var postData = [];

    // save every chunk of data, that the request delivers
    aRequest.on('data', function(chunk) {
        postData.push(chunk);
    });

    // request finished, now process it
    aRequest.on('end', function() {
        var urlParsed = mUrl.parse(aRequest.url),
            path = urlParsed.pathname,
            tmp, i;

        // region set GPC
        aRequest.post = Buffer.concat(postData);
        aRequest.postString = aRequest.post.toString(mRequestEncoding);
        aRequest.get = urlParsed.search ;
        aRequest.cookie = aRequest.headers.cookie;
        // endregion

        // generate request and response object
        var request = new mRequestObject(aRequest),
            args = {},
            response = new mResponseObject(aResponse),
            routeToExecute = null,
            routesLength = mRoutes.length;

        // find matching route
        for (i = 0; i < routesLength; i++) {
            if (mRoutes.hasOwnProperty(i) && typeof mRoutes[i] === 'object') {
                // check if it's the right route and store the result (for arguments)
                tmp = path.match(mRoutes[i].regex);
                // if tmp is null, this wasn't the right one
                if (tmp !== null) {
                    // play some memory
                    for (var y = 0; y < mRoutes[i].keys.length; y++) {
                        args[mRoutes[i].keys[y].name] = tmp[y+1];
                    }

                    // increment request counter
                    mRoutes[i].requestCounter++;

                    // found route, set route
                    routeToExecute = mRoutes[i].callback;

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
    // sort descend
    return aSecond.requestCounter - aFirst.requestCounter;
}

/**
 * Optimizes the mRoutes array
 *
 * @private
 **/
function mOptimizeRoutes() {
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
 * @static
 * @param {Number} aIntervalTime Time between optimizing in milliseconds
 * @return {$ROUTER} The instance itself
 **/
function mSetOptimizeInterval(aIntervalTime) {
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
        value: mRoute,
        enumerable: true
    },
    'addRoute': {
        value: mAddRoute,
        enumerable: true
    },
    'getRoute': {
        value: mGetRoute,
        enumerable: true
    },
    'setDefaultRoute': {
        value: mSetDefaultRoute,
        enumerable: true
    },
    'getDefaultRoute': {
        value: mGetDefaultRoute,
        enumerable: true
    },
    'setEncoding': {
        value: mSetEncoding,
        enumerable: true
    },
    'getEncoding': {
        value: mGetEncoding,
        enumerable: true
    },
    'addPreProcessor': {
        value: mAddPreProcessor,
        enumerable: true
    },
    'addPostProcessor': {
        value: mAddPostProcessor,
        enumerable: true
    },
    'clearRoutes': {
        value: mClearRoutes,
        enumerable: true
    },
    'setOptimizeInterval': {
        value: mSetOptimizeInterval,
        enumerable: true
    }
});

module.exports = EXPORTOBJECT;
