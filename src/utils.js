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
     * @return {Boolean}
     */
    static isObject(aValue) {
        return toString.call(aValue) === '[object Object]';
    }

    /**
     * Wraps given servelet in a corresponding function
     *
     * @static
     * @param {Object} aServelet The servelet to wrap
     * @return {Function} A controller function
     */
    static wrapServeletToFunction(aServelet) {
        return (aRequest, aResponse, aParamsHash) => {
            let methodName = aRequest.getMethod().toLowerCase();

            methodName = 'do' + methodName[0].toUpperCase() + methodName.slice(1);

            if (typeof aServelet[methodName] === 'function') {
                aServelet[methodName](aRequest, aResponse, aParamsHash);
            }
            else {
                aResponse
                    .setStatusCode(404)
                    .write('Not Found');
            }
        };
    }
}

module.exports = Utils;