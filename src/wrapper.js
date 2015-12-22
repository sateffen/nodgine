'use strict';

const pathToRegExp = require('path-to-regexp');

class Wrapper {
    constructor(aRoute, aCallback) {
        this._routeKeys = [];
        this._routePattern = pathToRegExp(aRoute, this._routeKeys);
        this._callback = aCallback;
    }

    runWhenRouteMatches(aRoute, aRequest, aResponse) {
        let match = aRoute.match(this._routePattern);
        
        if (match !== null) {
            return this.run(match, aRequest, aResponse);
        }
        else {
            return Promise.resolve();
        }
    }

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