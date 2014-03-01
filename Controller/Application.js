/**
 * This is the Application API for the nodgine module
 *
 * @module nodgine
 * @submodule $APPLICATION
 * @class $APPLICATION
 * @static
 **/

/**
 * The exporting object, which gets revealed
 *
 * @type {object}
 **/
var EXPORTOBJECT = new (require('events').EventEmitter)(),

    /**
     * A reference to the http-module
     *
     * @private
     * @type {http}
     **/
    mHttp = require('http'),

    /**
     * A reference to the https-module
     *
     * @private
     * @type {https}
     **/
    mHttps = require('https'),

    /**
     * A reference to the fs-module
     *
     * @private
     * @type {fs}
     **/
    mFs = require('fs'),

    /**
     * A reference to the path-module
     *
     * @private
     * @type {path}
     **/
    mPath = require('path'),

    /**
     * A reference to the nodgine-module
     *
     * @private
     * @type {$ROUTER}
     **/
    $ROUTER = require('./Router.js'),

    /**
     * A container, that holds all servers
     *
     * @private
     * @type {object}
     **/
    mServer = {http: null, https: null},

    /**
     * A container, that holds all known javascript classes with there files
     *
     * @private
     * @type {object}
     **/
    mClasses = {};

/**
 * Starts an HTTP server at given port
 *
 * @method startHTTP
 * @chainable
 * @param {number} aPort Port for HTTP-Server
 * @return {object} the instance itself
 **/
function mStartHTTP(aPort) {
    'use strict';
    if (aPort < 1 || aPort > 65535) {
        throw '$APPLICATION.startHTTP: First param aPort out of range. Port has to be between 1 and 65535, got ' + aPort;
    }

    if (!mServer.http) {
        mServer.http = mHttp.createServer($ROUTER.route);
    }
    
    mServer.http.listen(aPort);
    return EXPORTOBJECT;
}

/**
 * Starts an HTTPS server at given port with given options
 *
 * @method startHTTPS
 * @chainable
 * @param {string} aKey Path to a key-file
 * @param {string} aCert Path to a cert-file
 * @param {number} aPort Port for HTTP-Server
 * @param {object} aOptions additional options for the HTTPS-Server
 * @return {object} the instance itself
 **/
function mStartHTTPS(aKey, aCert, aPort, aOptions) {
    'use strict';
    if (aPort < 1 || aPort > 65535) {
        throw '$APPLICATION.startHTTPS: Third param aPort out of range. Port has to be between 1 and 65535, got' + aPort;
    }
    
    if (!mServer.https) {
        var options = {
            key: mFs.readFileSync(aKey),
            cert: mFs.readFileSync(aCert)
        };
        Object.getOwnPropertyNames(aOptions).forEach(function(aName) {
            options[aName] = aOptions[aName];
        });

        mServer.https = mHttps.createServer(options, $ROUTER.route);
    }
    
    mServer.https.listen(aPort);
    return EXPORTOBJECT;
}

/**
 * Stops the HTTP-Server, if any is started
 *
 * @method stopHTTP
 * @chainable
 * @return {object} the instance itself
 **/
function mStopHTTP() {
    'use strict';
    if (mServer.http) {
        mServer.http.close();
    }
    return EXPORTOBJECT;
}

/**
 * Stops the HTTPS-Server, if any is started
 *
 * @method stopHTTPS
 * @chainable
 * @return {object} the instance itself
 **/
function mStopHTTPS() {
    'use strict';
    if (mServer.https) {
        mServer.https.close();
    }
    return EXPORTOBJECT;
}

/**
 * Emit a start event to the application
 *
 * @method runApplication
 * @chainable
 * @return {object} the instance itself
 **/
function mRunApplication() {
    'use strict';
    EXPORTOBJECT.emit('startApplication');
    return EXPORTOBJECT;
}

/**
 * Emit a stop event to the application
 *
 * @method stopApplication
 * @chainable
 * @return {object} the instance itself
 **/
function mStopApplication() {
    'use strict';
    EXPORTOBJECT.emit('stopApplication');
    return EXPORTOBJECT;
}

/**
 * Emit a start event to the application
 *
 * @private
 * @param {string} aBasePath Path in which the javascript files should be searched for
 * @return {Array} a multi-dimensional array with all paths to all found javascript files
 **/
function mGetAllJSFiles(aBasePath) {
    'use strict';
    var files = mFs.readdirSync(aBasePath);
    var dirList = files.filter(function(file) {
        return mFs.statSync(mPath.join(aBasePath, file)).isDirectory() && file[0] !== '.';
    });
    var returnFiles = files.filter(function(file) {
        return mFs.statSync(mPath.join(aBasePath, file)).isFile() && file.substr(-3) === '.js';
    });
    returnFiles = returnFiles.map(function(file){
        return mPath.join(aBasePath, file);
    });

    while (dirList.length > 0) {
        returnFiles = returnFiles.concat(mGetAllJSFiles(mPath.join(aBasePath, dirList.shift())));
    }
    
    return returnFiles;
}

/**
 * Adds a loadpath for the load method, where to search for new classes
 *
 * @chainable
 * @method addLoadPath
 * @param {string} aPath Path, where to search for new javascript classes
 * @return {object} the instance itself
 **/
function mAddLoadPath(aPath) {
    'use strict';
    aPath = mPath.resolve(aPath);
    var jsFiles = mGetAllJSFiles(aPath);
    var jsClassNames = jsFiles.map(function(file) {
        var tmp = file.substring(aPath.length, file.length-3);
        tmp = (tmp[0] === mPath.sep) ? tmp.substr(mPath.sep.length) : tmp;
        var regex = (mPath.sep === '\\') ? new RegExp('\\\\', 'g'): new RegExp(mPath.sep, 'g');
        tmp = tmp.replace(regex, '_');
        return tmp;
    });

    for (var i=0;i<jsFiles.length;i++) {
        mClasses[jsClassNames[i]] = jsFiles[i];
    }
    return EXPORTOBJECT;
}

/**
 * Searches in all known pathes for specified class file and returns it
 *
 * @chainable
 * @method load
 * @param {string} aClassName The classname, for which the function should search
 * @return {function || null} The searched class or null
 **/
function mLoad(aClassName) {
    'use strict';
    if (mClasses[aClassName]) {
        return require(mClasses[aClassName]);
    }
    return null;
}

// extend EXPORTOBJECT with all properties to reveal
Object.defineProperties(EXPORTOBJECT, {
    'startHTTP': {
        value: mStartHTTP
    },
    'startHTTPS': {
        value: mStartHTTPS
    },
    'stopHTTP': {
        value: mStopHTTP
    },
    'stopHTTPS': {
        value: mStopHTTPS
    },
    'runApplication': {
        value: mRunApplication
    },
    'stopApplication': {
        value: mStopApplication
    },
    'addLoadPath': {
        value: mAddLoadPath
    },
    'load': {
        value: mLoad
    }
});

module.exports = EXPORTOBJECT;