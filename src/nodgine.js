/* global Buffer */
'use strict';

const libUrl = require('url');
const Wrapper = require('./wrapper');
const Request = require('./request');
const Response = require('./response');
const utils = require('./utils');

/**
 * The main class for the nodgine. This instance manages all dataflow
 */
class Nodgine {
    /**
     * Contructor for class Nodgine, sets up _middleware, _controller and _missingRouteController
     */
    constructor() {
        /**
         * A list of all registered middleware
         *
         * @private
         * @member {Array.<Wrapper>}
         */
        this._middleware = [];
        /**
         * A list of all registered controller
         *
         * @private
         * @member {Array.<Wrapper>}
         */
        this._controller = [];
        /**
         * A controller function that gets invoked whenever no corresponding controller was found.
         * Is set by setMissingRouteController
         *
         * @private
         * @member {Function}
         */
        this._missingRouteController = (aRequest, aResponse) => {
            // simply write statuscode 404, controller not found
            aResponse
                .setStatusCode(404)
                .write('Not Found');
        };
    }

    /**
     * Setter for missing route controller _missingRouteController. This is chainable
     *
     * @throws {TypeError} If called with anything different than a function
     * @param {Function} aController The controller to use if no other fits
     * @return this
     */
    setMissingRouteController(aController) {
        if (typeof aController !== 'function') {
            throw new TypeError('Unmatched signature. Prease use(controller<function>)');
        }

        this._missingRouteController = aController;

        return this;
    }

    /**
     * Adds given middleware to the middleware list. This is chainable
     *
     * @throws {TypeError} If called with a wrong signature
     * @param {String} [aRoute=/*] The route the middleware applies to (optional)
     * @param {Function} aMiddleware The middleware to add
     * @return this
     * @example
     * // applies only if the passed mattern matches
     * nodgineInstance.addMiddleware('/api/*', () => {});
     * // applies to every call
     * nodgineInstance.addMiddleware(() => {});
     */
    addMiddleware(aRoute, aMiddleware) {
        let route = aRoute;
        let middleware = aMiddleware;

        // check if this was called with signature (middleware<function>) and rewrite it to (route<string>, middleware<function>)
        if (typeof aRoute === 'function') {
            middleware = aRoute;
            route = '/*';
        }

        // check if signature matches
        if (typeof route !== 'string' || typeof middleware !== 'function') {
            throw new TypeError('Unmatched signature. Please use (middleware<function>) or (route<string>, middleware<function>)');
        }

        this._middleware.push(new Wrapper(route, middleware));

        return this;
    }

    /**
     * Adds given controller as route controller
     *
     * @throws {TypeError} If the call signature is not matched
     * @param {String} aRoute The route this controller applies for
     * @param {Function} aController The controller function itself
     * @return this
     * @example
     * nodgineInstance.addController('/user/:userid', () => {});
     */
    addController(aRoute, aController) {
        let controller = utils.isObject(aController) ? utils.wrapServeletToFunction(aController, this) : aController;

        if (typeof aRoute !== 'string' || typeof controller !== 'function') {
            throw new TypeError('Unmatched signature. Please use (route<string>, controller<function>) or (route<string>, controller<object>)');
        }

        this._controller.push(new Wrapper(aRoute, controller));

        return this;
    }

    /**
     * This function gets called by the router function to run all middleware with given params
     *
     * @private
     * @param {String} aParsedUrlPath The URL path for the current call
     * @param {Request} aRequest The request object for the current call
     * @param {Response} aResponse The response object for the current call
     * @return {Promise} A promise that gets resolved after every middleware was called
     */
    _runMiddleware(aParsedUrlPath, aRequest, aResponse) {
        let promisePointer = Promise.resolve();
        let middleWareList = this._middleware;

        for (let i = 0, len = middleWareList.length; i < len; i++) {
            promisePointer = promisePointer.then(
                middleWareList[i].runWhenRouteMatches
                    .bind(middleWareList[i], aParsedUrlPath, aRequest, aResponse)
                );
        }

        return promisePointer;
    }

    /**
     * This function gets called by the router function to run the corresponding controller with given params
     *
     * @private
     * @param {String} aParsedUrlPath The URL path for the current call
     * @param {Request} aRequest The request object for the current call
     * @param {Response} aResponse The response object for the current call
     * @return {Promise} A promise that gets resolved after the controller was finished
     */
    _runController(aParsedUrlPath, aRequest, aResponse) {
        let controllerList = this._controller;

        for (let i = 0, len = controllerList.length; i < len; i++) {
            let matchResult = aParsedUrlPath.match(controllerList[i].getPattern());

            if (matchResult !== null) {
                return controllerList[i].run(matchResult, aRequest, aResponse);
            }
        }
        
        // if this is reached, no controller was found
        return this._missingRouteController(aRequest, aResponse);
    }

    /**
     * Returns a function that can be used handler for the http/https server
     *
     * @private
     * @return {Function} A route handler
     */
    getRouter() {
        return (aRequest, aResponse) => {
            let requestBody = [];

            aRequest.on('data', (aChunk) => {
                requestBody.push(aChunk);
            });

            aRequest.on('end', () => {
                let parsedUrl = libUrl.parse(aRequest.url, true);
                let requestObject = new Request(aRequest, Buffer.concat(requestBody), parsedUrl);
                let responseObject = new Response(aResponse);

                return Promise.resolve()
                    .then(() => {
                        return this._runMiddleware(parsedUrl.pathname, requestObject, responseObject);
                    })
                    .then(() => {
                        return this._runController(parsedUrl.pathname, requestObject, responseObject);
                    })
                    .then(() => {
                        responseObject.flush();
                    })
                    .catch((aError) => {
                        if (!aResponse.finished) {
                            aResponse.writeHead(500);
                            aResponse.write('Internal Server Error');
                            aResponse.end();
                        }

                        if (aError instanceof Error) {
                            throw aError;
                        }
                    });
            });
        };
    }
}

module.exports = Nodgine;
