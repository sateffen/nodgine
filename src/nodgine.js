/* global Buffer */
'use strict';

const libUrl = require('url');
const Wrapper = require('./wrapper');
const Request = require('./request');
const Response = require('./response');
const utils = require('./utils');

class Nodgine {
    constructor() {
        this._middleware = [];
        this._controller = [];
        this._missingRouteController = (aRequest, aResponse) => {
            aResponse
                .setStatusCode(404)
                .write('Not Found');
        };
    }

    setMissingRouteController(aController) {
        if (typeof aController !== 'function') {
            throw new TypeError('Unmatched signature. Prease use(controller<function>)');
        }

        this._missingRouteController = aController;

        return this;
    }

    addMiddleware(aRoute, aMiddleware) {
        let route = aRoute;
        let middleware = aMiddleware;

        if (typeof aRoute === 'function') {
            middleware = aRoute;
            route = '/*';
        }

        if (typeof route !== 'string' || typeof middleware !== 'function') {
            throw new TypeError('Unmatched signature. Please use (middleware<function>) or (route<string>, middleware<function>)');
        }

        this._middleware.push(new Wrapper(route, middleware));

        return this;
    }

    addController(aRoute, aController) {
        let controller = utils.isObject(aController) ? utils.wrapServeletToFunction(aController) : aController;

        if (typeof aRoute !== 'string' || typeof controller !== 'function') {
            throw new TypeError('Unmatched signature. Please use (route<string>, controller<function>) or (route<string>, controller<object>)');
        }

        this._controller.push(new Wrapper(aRoute, controller));

        return this;
    }

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

    _runController(aParsedUrlPath, aRequest, aResponse) {
        let controllerList = this._controller;

        for (let i = 0, len = controllerList.length; i < len; i++) {
            let matchResult = aParsedUrlPath.match(controllerList[i].getPattern());

            if (matchResult !== null) {
                return controllerList[i].run(matchResult, aRequest, aResponse);
            }
        }
    }

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

                Promise.resolve()
                    .then(() => {
                        this._runMiddleware(parsedUrl.pathname, requestObject, responseObject);
                    })
                    .then(() => {
                        this._runController(parsedUrl.pathname, requestObject, responseObject);
                    })
                    .then(() => {
                        responseObject.flush();
                    })
                    .catch((aError) => {
                        console.error(aError.message, aError.stack);

                        if (!aResponse.finished) {
                            aResponse.writeHead(500);
                            aResponse.write('Internal Server Error');
                            aResponse.end();
                        }
                    });
            });
        };
    }
}

module.exports = Nodgine;
