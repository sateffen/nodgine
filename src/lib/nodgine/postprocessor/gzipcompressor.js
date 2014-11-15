'use strict';
var mZlib = require('zlib');

module.exports = function(aRequest, aResponse, aArgs, aCallback) {
    if (aRequest.headers['accept-encoding'] && aRequest.headers['accept-encoding'].indexOf('gzip') > -1) {
        var tmp = aResponse.nodgineGetWroteData();
        aResponse.nodgineResetWroteData();
        mZlib.gzip(tmp, function(error, result) {
            if (error) {
                aResponse.write(tmp);
            }
            else {
                aResponse.setHeader('Content-Encoding', 'gzip');
                aResponse.write(result);
            }

            aCallback();
        });
    }
    else {
        aCallback();
    }
};
