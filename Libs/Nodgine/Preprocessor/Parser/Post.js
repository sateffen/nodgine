var mQuerystring = require('querystring');

module.exports = function(aRequest, aResponse, aArgs, aCallback) {
    'use strict';

    if (aRequest.headers['content-type'] && aRequest.headers['content-type'].toLowerCase().indexOf('application/json') > -1) {
        // try to parse it, baby
        try {
            aRequest.post = JSON.parse(aRequest.post);
        }
            // nope, the parser didn't like it
        catch(e) {
            aRequest.post = {};
        }
    }
    // not an application/json, so simply parse it like normal
    else {
        aRequest.post = mQuerystring.parse(aRequest.post);
    }

    aCallback();
};