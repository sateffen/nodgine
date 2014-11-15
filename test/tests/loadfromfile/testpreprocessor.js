'use strict';
module.exports = function(aRequest, aResponse, aArgs, aCallback) {
    if (aRequest.url === '/nodginetestroute') {
        aResponse.write('pre');
    }
    aCallback();
};
