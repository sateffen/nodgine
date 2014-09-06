module.exports = function(aRequest, aResponse, aArgs, aCallback) {
    'use strict';

    if (aRequest.headers['content-type'] && aRequest.headers['content-type'].toLowerCase().indexOf('application/json') > -1) {
        // try to parse it, baby
        try {
            aRequest.post = JSON.parse(aRequest.post.toString());
        }
            // nope, the parser didn't like it
        catch(e) {
            aRequest.post = {};
        }
    }

    aCallback();
};