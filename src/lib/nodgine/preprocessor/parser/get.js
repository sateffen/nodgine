var mQueryString = require('querystring');

module.exports = function(aRequest, aResponse, aArgs, aCallback) {
    'use strict';

    // remove trailing ?
    if (typeof aRequest.get === 'string') {
        aRequest.get = aRequest.get.substr(1);
    }

    // parse the querystring
    aRequest.get = mQueryString.parse(aRequest.get);

    aCallback();
};