
module.exports = function(aResponse) {
    'use strict';

    var mPostProcessorCallback;
    aResponse.nodgineResponseEnd = aResponse.end;
    aResponse.registerPostProcessorCallback = function(callback) {
        mPostProcessorCallback = callback;
    }
    aResponse.end = function(data, encoding) {
        console.log('HE');
        aResponse.write(data, encoding);
        process.nextTick(function() {
            mPostProcessorCallback();
        });
    };

    return aResponse;
};