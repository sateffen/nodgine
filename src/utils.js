'use strict';

function isObject(aValue) {
    return toString.call(aValue) === '[object Object]';
}

function wrapServeletToFunction(aServelet) {
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

module.exports = {
    wrapServeletToFunction,
    isObject
};