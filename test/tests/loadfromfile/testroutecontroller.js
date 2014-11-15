'use strict';
module.exports = {
    doGet: function(aRequest, aResponse, aArgs) {
        aResponse.writeHead(200);
        aResponse.end('success');
    }
};
