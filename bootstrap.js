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
            throw 'Nodgine.loadFromFile: Can\'t parse JSON from file ' + aFile + '. Please check, if it\'s valid JSON. Errormessage: ' + e.getMessage;
        }

        // evaluate file
        var basePath = (fileContent.basepath && typeof fileContent.basepath === 'string') ?
                mPath.resolve(mPath.dirname(aFile), mPath.normalize(fileContent.basepath)) :
                mPath.dirname(aFile),
            $ROUTER  = require('./Controller/Router.js'),
            $SERVICE = require('./Controller/Service.js'),
            $APPLICATION = require('./Controller/Application.js');

        if (fileContent.loadpaths && Array.isArray(fileContent.loadpaths)) {
            fileContent.loadpaths.forEach(function (path) {
                $APPLICATION.addLoadPath(mPath.join(basePath, path));
            });
        }

        if (fileContent.routes && Array.isArray(fileContent.routes)) {
            fileContent.routes.forEach(function (route) {
                var controller = require(mPath.join(basePath, route.controller));
                $ROUTER.addRoute(route.route, controller, !!route.caseSensetive);
            });
        }

        if (fileContent.preprocessors && Array.isArray(fileContent.preprocessors)) {
            fileContent.preprocessors.forEach(function (processor) {
                var controller = require(mPath.join(basePath, processor));
                $ROUTER.addPreProcessor(controller);
            });
        }

        if (fileContent.postprocessors && Array.isArray(fileContent.postprocessors)) {
            fileContent.postprocessors.forEach(function (processor) {
                var controller = require(mPath.join(basePath, processor));
                $ROUTER.addPostProcessor(controller);
            });
        }

        if (fileContent.services && Array.isArray(fileContent.services)) {
            fileContent.services.forEach(function (service) {
                var controller = require(mPath.join(basePath, service.controller));
                $SERVICE.registerService(service.id, service.type, controller);
            });
        }

        if (fileContent.http && fileContent.http.port){
            $APPLICATION.startHTTP(fileContent.http.port);
        }

        if (fileContent.https && fileContent.https.port && fileContent.https.key && fileContent.https.cert){
            $APPLICATION.startHTTPS(
                mPath.join(basePath, fileContent.https.key),
                mPath.join(basePath, fileContent.https.cert),
                fileContent.https.port,
                fileContent.https.options);
        }

        if (fileContent.logger) {
            if (fileContent.logger.minimumLogLevel !== undefined) {
                $LOGGER.setMinimumLogLevel(fileContent.logger.minimumLogLevel);
            }

            if (fileContent.logger.writeToConsole !== undefined) {
                $LOGGER.writeToConsole(fileContent.logger.writeToConsole);
            }

            if (fileContent.logger.writeToFile !== undefined) {
                $LOGGER.writeToFile(fileContent.logger.writeToFile);
            }

            if (typeof fileContent.logger.logFile === 'string') {
                $LOGGER.setLogFile(fileContent.logger.logFile);
            }
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
        value   : require('./Controller/Application.js'),
        enumerable: true
    },

    /**
     * An instance of $ROUTER
     *
     * @property $ROUTER
     * @type {$ROUTER}
     **/
    '$ROUTER': {
        value   : require('./Controller/Router.js'),
        enumerable: true
    },

    /**
     * An instance of $LOGGER
     *
     * @property $LOGGER
     * @type {$LOGGER}
     **/
    '$LOGGER': {
        value   : require('./Controller/Logger.js'),
        enumerable: true
    },

    /**
     * An instance of $SERVICE
     *
     * @property $SERVICE
     * @type {$SERVICE}
     **/
    '$SERVICE': {
        value   : require('./Controller/Service.js'),
        enumerable: true
    },

    // define the rest
    'globalize': {
        value   : mGlobalize,
        enumerable: true
    },
    'loadFromFile': {
        value   : mLoadFromFile,
        enumerable: true
    }
});

module.exports = EXPORTOBJECT;