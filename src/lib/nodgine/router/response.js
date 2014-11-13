
var mStream = require('stream');

module.exports = function(aResponse) {
    'use strict';

    // TODO: Comment

    var mPostProcessorCallback,
        mWroteData = new Buffer(0),
        mReasonPhrase = '';

    aResponse.nodgineResponseEnd = aResponse.end;
    aResponse.nodgineResponsePipe = aResponse.pipe;
    aResponse.nodgineResponseWrite = aResponse.write;
    aResponse.nodgineResponseWriteHead = aResponse.writeHead;
    aResponse.nodgineResponseWriteContinue = aResponse.writeContinue;

    aResponse.nodgineGetWroteData = function() {
        return mWroteData;
    };

    aResponse.nodgineResetWroteData = function() {
        mWroteData = new Buffer(0);
    };

    aResponse.nodgineEnd = function() {
        aResponse.nodgineResponseWriteHead(
            aResponse.statusCode,
            mReasonPhrase
        );

        aResponse.nodgineResponseWrite(mWroteData);
        aResponse.nodgineResponseEnd();
    };

    aResponse.pipe = function(aReadableStream, aCallback) {
        var tmp = [];

        if (aReadableStream instanceof mStream.Readable) {
            aReadableStream.on('data', function(data) {
                tmp.push(data);
            });

            aReadableStream.on('end', function() {
                var concatTmp = Buffer.concat(tmp);
                if (typeof aCallback === 'function') {
                    aResponse.write(concatTmp);
                    aCallback();
                }
                else {
                    aResponse.end(concatTmp);
                }
            });
        }
        else {
            throw 'Response.pipe: First param needs to be a readable stream.';
        }
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

    aResponse.write = function(aData, aEncoding) {
        //mWroteData.push({data: aData, encoding: aEncoding});
        var tmp;
        if (typeof aData === 'string') {
            tmp = new Buffer(aData, aEncoding);
        }
        else if (aData instanceof Buffer) {
            tmp = aData;
        }
        else {
            throw 'Response.write needs a string or buffer as first argument.';
        }

        mWroteData = Buffer.concat([mWroteData, tmp]);
    };

    aResponse.nodgineResponseEndCallback = function(callback) {
        mPostProcessorCallback = callback;
    };

    aResponse.end = function(aData, aEncoding) {
        if (aData) {
            aResponse.write(aData, aEncoding);
        }

        process.nextTick(function() {
            mPostProcessorCallback();
        });
    };

    return aResponse;
};
