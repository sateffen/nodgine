
module.exports = {
    doGet: function(aRequest, aResponse, aArgs) {
        'use strict';
        aResponse.writeHead(200);
        aResponse.end('success');
    }
};
