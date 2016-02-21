/* global Buffer */
'use strict';

/**
 * The response wrapper class
 */
class Response {
    /**
     * Constructor for the reponse class
     *
     * @param {Object} aParamsObject A params object that contains all request related params
     */
    constructor(aParamsObject) {
        /**
         * A pointer to the original response object
         *
         * @private
         * @member {NodeHttpResponse}
         */
        this._originalResponse = aParamsObject.response;
        
        /**
         * A ordered list of buffers that got written
         *
         * @private
         * @member {Array.<Buffer>}
         */
        this._sendBufferList = [];
        /**
         * A hash of headers, that should be send
         *
         * @private
         * @member {Object}
         */
        this._headerHash = {};
        /**
         * The statuscode to send
         *
         * @private
         * @member {Number}
         * @default 200
         */
        this._statusCode = 200;
        /**
         * A flag telling whether the request was already flushed or not
         *
         * @private
         * @member {Boolean}
         */
        this._isFlushed = false;
    }
    
    /**
     * Sets the status code for this response. This is chainable
     *
     * @param {Number} aStatusCode The statuscode to set
     * @return {this} The instance itself
     */
    setStatusCode(aStatusCode) {
        if (typeof aStatusCode !== 'number' || aStatusCode % 1 !== 0) {
            throw new TypeError('Unmatched signature. Please call with (statuscode<integer>)');
        }
        
        this._statusCode = aStatusCode;
        
        return this;
    }
    
    /**
     * A getter for the status code
     *
     * @return {Number} The currently set statuscode
     */
    getStatusCode() {
        return this._statusCode;
    }
    
    /**
     * Writes given data to the internal buffer
     *
     * @throws {TypeError} If the param has wrong type (not string of buffer)
     * @param {Buffer|String} aData A buffer or string that should get written to the response
     * @return {this} The instance itself
     */
    write(aData) {
        let data = aData;
        
        // if the data is a stream, convert it to a buffer
        if (typeof data === 'string') {
            data = new Buffer(data);
        }
        
        // if the written data is no stream, throw an typeerror
        if (!Buffer.isBuffer(data)) {
            throw new TypeError('Unmatched signature. Please call with (data<string>) or (data<Buffer>)');
        }
        
        this._sendBufferList.push(data);
        
        return this;
    }
    
    /**
     * Sets the header
     *
     * @throws {TypeError} If the given params have the wrong types
     * @param {String} aHeader The header name
     * @param {String} aValue The value for the header
     * @return {this} The instance itself
     */
    setHeader(aHeader, aValue) {
        if (typeof aHeader !== 'string' || typeof aValue !== 'string') {
            throw new TypeError('Unmatched signature. Please call with (string, string)');
        }
        
        this._headerHash[aHeader.toLowerCase()] = aValue;
        
        return this;
    }
    
    /**
     * Getter for given header
     *
     * @param {String} aHeader The header to get
     * @return {String|undefined} The header value or undefined
     */
    getHeader(aHeader) {
        return this._headerHash[typeof aHeader === 'string' ? aHeader.toLowerCase() : ''];
    }
    
    /**
     * Whether the specified header was set
     *
     * @param {String} aHeader The header to check
     * @return {Boolean} Whether the header is set or not
     */
    hasHeader(aHeader) {
        return typeof this._headerHash[typeof aHeader === 'string' ? aHeader.toLowerCase() : ''] === 'string';
    }
    
    /**
     * Removes given header from the header list
     *
     * @param {String} aHeader The header to remove
     * @return {this} The instance itself
     */
    removeHeader(aHeader) {
        // do not use "delete", because this is a "hot object" for the time being.
        // with delete we could create a "slow zone", so simply ignore it, for node
        // it's the same either way
        this._headerHash[typeof aHeader === 'string' ? aHeader.toLowerCase() : ''] = undefined;
        
        return this;
    }
    
    /**
     * Sends the data buffered in this object to the original response object and
     * ends the stream.
     * After flushing the response the first time, this will throw an error
     *
     * @throws {Error} If flushed twice
     * @return {this} The instance itself
     */
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