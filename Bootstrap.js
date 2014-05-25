/**
 * This is the bootstrap for the nodgine module
 *
 * @module nodgine
 * @main
 * @class nodgine
 * @static
 **/

/**
 * The exporting object, which gets revealed
 *
 * @type {object}
 **/
var EXPORTOBJECT = {},

    /**
     * A reference to the fs-module
     *
     * @private
     * @type {path}
     **/
    mFs = require('fs'),
    /**
     * A reference to the path-module
     *
     * @private
     * @type {fs}
     **/
    mPath = require('path');

/**
 * This function makes the APIs of this framework global
 *
 * @method globalize
 **/
function mGlobalize() {
    'use strict';
    Object.defineProperties(GLOBAL, {
        '$APPLICATION': {
            value   : require('./Controller/Application.js')
        },
        '$ROUTER': {
            value   : require('./Controller/Router.js')
        },
        '$LOGGER': {
            value   : require('./Controller/Logger.js')
        },
        '$SERVICE': {
            value   : require('./Controller/Service.js')
        }
    });
}

/**
 * This function loads given json-file and parses and evalutates it
 *
 * @method loadFromFile
 * @param {string} aFile Path to file that should be evaluated
 **/
function mLoadFromFile(aFile) {
    'use strict';
    if (typeof aFile !== 'string') {
        throw 'Nodgine.loadFromFile: First param needs to be string, got ' + typeof aFile;
    }

    // check if file is actually usable
    if (mFs.existsSync(aFile) && mFs.statSync(aFile).isFile()) {
        // read and parse file
        var fileContent = mFs.readFileSync(aFile);
        try {
            fileContent = JSON.parse(fileContent);
        }
        catch(e) {
            throw 'Nodgine.loadFromFile: Can\'t parse JSON from file ' + aFile + '. Please check, if it\'s valid JSON.' + e.getMessage;
        }

        // evaluate file
        var basepath = (fileContent.basepath && typeof fileContent.basepath === 'string') ? mPath.normalize(fileContent.basepath) : '',
            $ROUTER  = require('./Controller/Router.js'),
            $SERVICE = require('./Controller/Service.js'),
            $APPLICATION = require('./Controller/Application.js');

        if (fileContent.loadpaths && Array.isArray(fileContent.loadpaths)) {
            fileContent.loadpaths.forEach(function (path) {
                $APPLICATION.addLoadPath(mPath.join(basepath, path));
            });
        }

        if (fileContent.routes && Array.isArray(fileContent.routes)) {
            fileContent.routes.forEach(function (route) {
                var controller = require(mPath.join(basepath, route.controller));
                $ROUTER.addRoute(route.route, controller, !!route.caseSensetive);
            });
        }

        if (fileContent.preprocessors && Array.isArray(fileContent.preprocessors)) {
            fileContent.preprocessors.forEach(function (processor) {
                var controller = require(mPath.join(basepath, processor.controller));
                $ROUTER.addPreProcessor(controller);
            });
        }

        if (fileContent.postprocessors && Array.isArray(fileContent.postprocessors)) {
            fileContent.postprocessors.forEach(function (processor) {
                var controller = require(mPath.join(basepath, processor.controller));
                $ROUTER.addPreProcessor(controller);
            });
        }

        if (fileContent.services && Array.isArray(fileContent.services)) {
            fileContent.services.forEach(function (service) {
                var controller = require(mPath.join(basepath, service.controller));
                $SERVICE.registerService(service.id, service.type, controller);
            });
        }

        if (fileContent.http && fileContent.http.port){
            $APPLICATION.startHTTP(fileContent.http.port);
        }

        if (fileContent.https && fileContent.https.port && fileContent.https.key && fileContent.https.cert){
            $APPLICATION.startHTTPS(
                mPath.join(basepath, fileContent.https.key),
                mPath.join(basepath, fileContent.https.cert),
                fileContent.https.port,
                fileContent.https.options);
        }
    }
    else {
        throw 'Nodgine.loadFromFile: Can\'t read file ' + aFile;
    }
}

require('./Controller/Application.js').addLoadPath(__dirname + '/Lib');

//region revealing object

Object.defineProperties(EXPORTOBJECT, {

    /**
     * An instance of $APPLICATION
     *
     * @property $APPLICATION
     * @type {$APPLICATION}
     **/
    '$APPLICATION': {
        value   : require('./Controller/Application.js')
    },

    /**
     * An instance of $ROUTER
     *
     * @property $ROUTER
     * @type {$ROUTER}
     **/
    '$ROUTER': {
        value   : require('./Controller/Router.js')
    },

    /**
     * An instance of $LOGGER
     *
     * @property $LOGGER
     * @type {$LOGGER}
     **/
    '$LOGGER': {
        value   : require('./Controller/Logger.js')
    },

    /**
     * An instance of $SERVICE
     *
     * @property $SERVICE
     * @type {$SERVICE}
     **/
    '$SERVICE': {
        value   : require('./Controller/Service.js')
    },

    // define the rest
    'globalize': {
        value   : mGlobalize
    },
    'loadFromFile': {
        value   : mLoadFromFile
    }
});

module.exports = EXPORTOBJECT;