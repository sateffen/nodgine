'use strict';
module.exports = function(aRequest, aResponse, aArgs, aCallback) {
    var cookies = (aRequest.cookie) ? aRequest.cookie.split(';') : [],
        tmp = null;
    // now: do the cookie dance
    for (var x in cookies) {
        if (cookies.hasOwnProperty(x) && typeof cookies[x] === 'string') {
            tmp = cookies[x].split('=');
            aRequest.cookie[tmp[0]] = tmp[1];
        }
    }

    aCallback();
};
