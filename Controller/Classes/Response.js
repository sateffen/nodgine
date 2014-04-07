
module.exports = function(aResponse) {
    'use strict';

    // TODO: Comment

    var mPostProcessorCallback,
        mWroteData = [],
        mReasonPhrase = '';

    aResponse.nodgineResponseEnd = aResponse.end;
    aResponse.nodgineResponseWrite = aResponse.write;
    aResponse.nodgineResponseWriteHead = aResponse.writeHead;
    aResponse.nodgineResponseWriteContinue = aResponse.writeContinue;

    aResponse.nodgineEnd = function() {
        aResponse.nodgineResponseWriteHead(
            aResponse.statusCode,
            mReasonPhrase,
            aResponse._headers
        );
        for (var i = 0; i < mWroteData.length; i++) {
            aResponse.nodgineResponseWrite(mWroteData[i].data, mWroteData[i].encoding);
        }

        aResponse.nodgineResponseEnd();
    };

    aResponse.writeHead = function(aStatuscode, aReasonPhrase, aHeaders) {
        aResponse.statusCode = aStatuscode;
        var headers = {};

        if (typeof aReasonPhrase === 'string') {
            mReasonPhrase = aReasonPhrase;
        }

        if (typeof aReasonPhrase === 'object') {
            headers = aReasonPhrase;
        }
        else if (typeof aHeaders === 'object') {
            headers = aHeaders;
        }

        for (var x in headers) {
            if (headers.hasOwnProperty(x)) {
                aResponse.setHeader(x, headers[x]);
            }
        }
    };

    aResponse.writeContiunue = function() {
        // TODO: Make it supported
        throw 'Response.writeContinue: This function is not supported by the nodgine';
    };

    aResponse.write = function(aData, aEncoding) {
        mWroteData.push({data: aData, encoding: aEncoding});
    };

    aResponse.nodgineResponseEndCallback = function(callback) {
        mPostProcessorCallback = callback;
    };

    aResponse.end = function(aData, aEncoding) {
        aResponse.write(aData, aEncoding);

        process.nextTick(function() {
            mPostProcessorCallback();
        });
    };

    return aResponse;
};