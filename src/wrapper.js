'use strict';

const pathToRegExp = require('path-to-regexp');

/**
 * A wrapper for middleware and controller
 */
class Wrapper {
    /**
     * Constructor for a wrapper.
     *
     * @param {String} aRoute The route for this callback
     * @param {Function} aCallback The callback for this middleware or callback
     */
    constructor(aRoute, aCallback) {
        /**
         * The variables for this route
         *
         * @private
         * @member {Array.<String>}
         */
        this._routeKeys = [];
        /**
         * The route pattern for this route
         *
         * @private
         * @member {RegExp}
         */
        this._routePattern = pathToRegExp(aRoute, this._routeKeys);
        /**
         * A pointer to given callback
         *
         * @private
         * @member {Function}
         */
        this._callback = aCallback;
    }

    /**
     * Getter for the pattern
     *
     * @return {RegExp} The pattern for this wrapper
     */
    getPattern() {
        return this._routePattern;
    }

    /**
     * Runs this wrapper if given route matches
     *
     * @param {String} aRoute The route to run
     * @param {Request} aRequest The request object for the current call
     * @param {Response} aResponse The response object for the current call
     * @return {Promise} A promise that gets resolved after everything is done
     */
    runWhenRouteMatches(aRoute, aRequest, aResponse) {
        let match = aRoute.match(this._routePattern);

        if (match !== null) {
            return this.run(match, aRequest, aResponse);
        }
        else {
            return Promise.resolve();
        }
    }

    /**
     * Runs the callback with given parameters
     *
     * @param {Array.<String>} aMatchResult A result of matches for the route.match(thisWrapper.getPattern())
     * @param {Request} aRequest The request object for the current call
     * @param {Response} aResponse The response object for the current call
     * @return {Promise} A promise that gets resolved after everything is done
     */
    run(aMatchResult, aRequest, aResponse) {
        return new Promise((aResolve, aReject) => {
            let paramsHash = {};

            for (let i = 0, len = this._routeKeys.length; i < len; i++) {
                paramsHash[this._routeKeys[i].name] = aMatchResult[i + 1];
            }

            let returnPromise = this._callback(aRequest, aResponse, paramsHash);

            if (returnPromise instanceof Promise) {
                returnPromise
                    .then(aResolve)
                    .catch(aReject);
            }
            else if (returnPromise === false) {
                aReject();
            }
            else {
                aResolve();
            }
        });
    }
}

module.exports = Wrapper;