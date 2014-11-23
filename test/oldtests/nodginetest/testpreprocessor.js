
module.exports = function(aRequest, aResponse, aArgs, aCallback) {
    'use strict';

    if (aRequest.url === '/nodginetestroute') {
        aResponse.write('pre');
    }
    aCallback();
};
