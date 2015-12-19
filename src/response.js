'use strict';

class Response {
    constructor(aResponse) {
        this._originalResponse = aResponse;
        
        this._sendBufferList = [];
        this._headerHash = {};
        this._statusCode = 200;
        this._isFlushed = false;
    }
    
    setStatusCode(aStatusCode) {
        if (typeof aStatusCode !== 'number' || aStatusCode % 1 !== 0) {
            throw new TypeError('Unmatched signature. Please call with (statuscode<integer>)');
        }
        
        this._statusCode = aStatusCode;
        
        return this;
    }
    
    getStatusCode() {
        return this._statusCode;
    }
    
    write(aData) {
        let data = aData;
        
        if (typeof data === 'string') {
            data = new Buffer(data);
        }
        
        if (!Buffer.isBuffer(data)) {
            throw new TypeError('Unmatched signature. Please call with (data<string>) or (data<Buffer>)');
        }
        
        this._sendBufferList.push(data);
        
        return this;
    }
    
    setHeader(aHeader, aValue) {
        if (typeof aHeader !== 'string' || typeof aValue !== 'string') {
            throw new TypeError('Unmatched signature. Please call with (string, string)');
        }
        
        this._headerHash[aHeader] = aValue;
        
        return this;
    }
    
    getHeader(aHeader) {
        return this._headerHash[aHeader];
    }
    
    hasHeader(aHeader) {
        return typeof this._headerHash[aHeader] === 'string';
    }
    
    removeHeader(aHeader) {
        this._headerHash[aHeader] = undefined;
        
        return this;
    }
    
    flush() {
        if (this._isFlushed) {
            throw new Error('Cannot flush a response twice');
        }
        this._isFlushed = true;
        
        this._originalResponse.writeHead(this._statusCode, this._headerHash);
        this._originalResponse.write(Buffer.concat(this._sendBufferList));
        this._originalResponse.end();
        
        return this;
    }
}

module.exports = Response;