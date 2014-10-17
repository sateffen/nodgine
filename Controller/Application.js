/**
 * This is the Application API for the nodgine module
 *
 * @module $APPLICATION
 **/

/**
 * The exporting object, which gets revealed
 *
 * @private
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
     * A container, that holds all known javascript classes with there files, used by load-path
     *
     * @private
     * @type {object}
     **/
    mClasses = {};

/**
 * Starts an HTTP server at given interface
 *
 * @method startHTTP
 * @static
 * @param {number|string} aInterface -  Port or hostname:port for HTTP-Server
 * @return {$APPLICATION} The instance itself
 *
 * @example
 *      $APPLICATION.startHTTP(8888); // starts http-server at 0.0.0.0:8888
 *      $APPLICATION.startHTTP('127.0.0.1:7777'); // starts http-server reachable from 127.0.0.1:7777
 **/
function mStartHTTP(aInterface) {
    'use strict';
    var port, hostname;
    if (typeof aInterface === 'number') {
        port = aInterface
    }
    else if (typeof aInterface === 'string') {
        var parts = aInterface.split(':');
        if (parts.length === 2) {
            hostname = parts[0];
            port = parseInt(parts[1], 10);
        }
        else if (parts.length === 1) {
            port = parseInt(parts[0], 10);
        }
    }

    if (port < 1 || port > 65535) {
        throw '$APPLICATION.startHTTP: First param aInterface has a port out of range. Port has to be between 1 and 65535, got' + port;
    }

    if (!mServer.http) {
        mServer.http = mHttp.createServer($ROUTER.route);
    }
    
    mServer.http.listen(port, hostname);
    return EXPORTOBJECT;
}

/**
 * Starts an HTTPS server at given port with given options
 *
 * @method startHTTPS
 * @static
 * @param {string} aKey - Path to a key-file (Hint: Best is an absolute path)
 * @param {string} aCert - Path to a cert-file (Hint: Best is an absolute path)
 * @param {number|string} aInterface - Port or hostname:port for HTTP-Server
 * @param {object} [aOptions] - Additional options for the HTTPS-Server
 * @return {$APPLICATION} The instance itself
 **/
function mStartHTTPS(aKey, aCert, aInterface, aOptions) {
    'use strict';
    // check port
    var port, hostname;
    aOptions = aOptions || {};
    if (typeof aInterface === 'number') {
        port = aInterface
    }
    else if (typeof aInterface === 'string') {
        var parts = aInterface.split(':');
        if (parts.length === 2) {
            hostname = parts[0];
            port = parseInt(parts[1], 10);
        }
        else if (parts.length === 1) {
            port = parseInt(parts[0], 10);
        }
    }

    if (port < 1 || port > 65535) {
        throw '$APPLICATION.startHTTPS: Third param aInterface has a port out of range. Port has to be between 1 and 65535, got' + port;
    }

    // if no https server is started
    if (!mServer.https) {
        // prepare options
        var options = {
            key: mFs.readFileSync(aKey),
            cert: mFs.readFileSync(aCert)
        };
        Object.getOwnPropertyNames(aOptions).forEach(function(aName) {
            options[aName] = aOptions[aName];
        });

        mServer.https = mHttps.createServer(options, $ROUTER.route);
    }

    mServer.https.listen(port, hostname);
    return EXPORTOBJECT;
}

/**
 * Stops the HTTP-Server, if any is started
 *
 * @method stopHTTP
 * @static
 * @return {$APPLICATION} The instance itself
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
 * @static
 * @return {$APPLICATION} The instance itself
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
 * @static
 * @return {$APPLICATION} The instance itself
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
 * @static
 * @return {$APPLICATION} The instance itself
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
 * @param {string} aBasePath - Path in which the javascript files should be searched for
 * @return {Array} a multi-dimensional array with all paths to all found javascript files
 **/
function mGetAllJSFiles(aBasePath) {
    'use strict';
    // first, read the basedir
    var files = mFs.readdirSync(aBasePath);
    // than filter the basedir for directorys
    var dirList = files.filter(function(file) {
        return mFs.statSync(mPath.join(aBasePath, file)).isDirectory() && file[0] !== '.';
    });
    // now filter the basedir for js files
    var returnFiles = files.filter(function(file) {
        return mFs.statSync(mPath.join(aBasePath, file)).isFile() && file.substr(-3) === '.js';
    });
    // now map the returnfiles to their absolute paths
    returnFiles = returnFiles.map(function(file){
        return mPath.join(aBasePath, file);
    });

    // for every dir, search in the dir and concat it to the return files
    // this way all files will get found recursivly
    while (dirList.length > 0) {
        returnFiles = returnFiles.concat(mGetAllJSFiles(mPath.join(aBasePath, dirList.shift())));
    }

    // return the filelist
    return returnFiles;
}

/**
 * Adds a loadpath for the load method, where to search for new classes
 *
 * @method addLoadPath
 * @static
 * @param {string} aPath - Path, where to search for new javascript classes (Hint: Best is an absolute path)
 * @return {$APPLICATION} The instance itself
 **/
function mAddLoadPath(aPath) {
    'use strict';
    // first of all: resolve the path to an absolute path
    aPath = mPath.resolve(aPath);
    // search for all JS files in this path, recursivly
    var jsFiles = mGetAllJSFiles(aPath);
    // mark all found files in the map
    var jsClassNames = jsFiles.map(function(file) {
        // get the sub filepath without file extension
        // example: aPath = /test, file = /test/foo/bar.js, result: /foo/bar
        var tmp = file.substring(aPath.length, file.length-3);
        // cleanup trailing slash
        tmp = (tmp[0] === mPath.sep) ? tmp.substr(mPath.sep.length) : tmp;
        // generate a regex for the path seperator
        var regex = (mPath.sep === '\\') ? new RegExp('\\\\', 'g'): new RegExp(mPath.sep, 'g');
        // replace every pathseperator with an _, so foo/bar will get foo_bar and direct to /test/foo/bar.js
        tmp = tmp.replace(regex, '_');
        // return the new filename
        return tmp;
    });

    // cause the map and files are an equal array, with every entry, simply with recalculated values, map them together
    // to a real classmap
    for (var i=0;i<jsFiles.length;i++) {
        mClasses[jsClassNames[i]] = jsFiles[i];
    }
    // and finally, make it chainable
    return EXPORTOBJECT;
}

/**
 * Searches in all known paths for specified class file and returns it
 *
 * @method load
 * @static
 * @param {string} aClassName - The class-name, for which the function should search
 * @return {function|object|null} The result of the require()
 **/
function mLoad(aClassName) {
    'use strict';
    // if class exists
    if (mClasses[aClassName]) {
        // it's required
        return require(mClasses[aClassName]);
    }
    // otherwise it's not
    return null;
}

/**
 * Returns the http server object for direct interaction, for example if you want to pass it through to a websocket library
 *
 * @method getHttpServer
 * @static
 * @return {httpServer|null}
 **/
function mGetHttpServer() {
    'use strict';
    return mServer.http;
}

/**
 * Returns the https server object for direct interaction, for example if you want to pass it through to a websocket library
 *
 * @method getHttpsServer
 * @static
 * @return {httpsServer|null}
 **/
function mGetHttpsServer() {
    'use strict';
    return mServer.https;
}

// extend EXPORTOBJECT with all properties to reveal
Object.defineProperties(EXPORTOBJECT, {
    'startHTTP': {
        value: mStartHTTP,
        enumerable: true
    },
    'startHTTPS': {
        value: mStartHTTPS,
        enumerable: true
    },
    'stopHTTP': {
        value: mStopHTTP,
        enumerable: true
    },
    'stopHTTPS': {
        value: mStopHTTPS,
        enumerable: true
    },
    'runApplication': {
        value: mRunApplication,
        enumerable: true
    },
    'stopApplication': {
        value: mStopApplication,
        enumerable: true
    },
    'addLoadPath': {
        value: mAddLoadPath,
        enumerable: true
    },
    'load': {
        value: mLoad,
        enumerable: true
    },
    'getHttpServer': {
        value: mGetHttpServer,
        enumerable: true
    },
    'getHttpsServer': {
        value: mGetHttpsServer,
        enumerable: true
    }
});

module.exports = EXPORTOBJECT;