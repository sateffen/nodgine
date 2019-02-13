'use strict';

/**
 * A utility class, holding some static helper methods
 */
class Utils {
    /**
     * Checks whether given value is an object or not
     *
     * @static
     * @param {Any} aValue The value to test
     * @return {Boolean} Whether it's an object or not
     */
    static isObject(aValue) {
        return toString.call(aValue) === '[object Object]';
    }

    /**
     * Wraps given servelet in a corresponding function
     *
     * @static
     * @param {Object} aServelet The servelet to wrap
     * @param {Object} aNodgineInstance The nodgine instance with the missing route controller to use
     * @return {Function} A controller function
     */
    static wrapServeletToFunction(aServelet, aNodgineInstance) {
        return (aRequest, aResponse, aParamsHash) => {
            let methodName = aRequest.getMethod().toLowerCase();

            methodName = 'do' + methodName[0].toUpperCase() + methodName.slice(1);

            if (typeof aServelet[methodName] === 'function') {
                aServelet[methodName](aRequest, aResponse, aParamsHash);
            }
            else {
                aNodgineInstance._missingRouteController(aRequest, aResponse);
            }
        };
    }
}

module.exports = Utils;
