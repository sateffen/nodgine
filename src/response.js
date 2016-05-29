/* global Buffer */
'use strict';

const EventEmitter = require('events');
const stream = require('stream');

/**
 * The response wrapper class
 */
class Response extends EventEmitter {
    /**
     * Constructor for the reponse class
     *
     * @param {Object} aParamsObject A params object that contains all request related params
     */
    constructor(aParamsObject) {
        super();
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
         * The length of all collected buffers. Is used for better performance on concat
         *
         * @private
         * @member {Number}
         */
        this._sendBufferListLength = 0;

        /**
         * A stream to send to the receiver
         *
         * @private
         * @member {ReadableStream}
         */
        this._streamToPipe = null;

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

        /**
         * Close event. See [HERE](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_event_close_1)
         *
         * @event close
         * @type {Response} The instance itself
         */
        this._originalResponse.on('close', () => {
            this.emit('close', this);
        });

        /**
         * Finish event. See [HERE](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_event_finish)
         *
         * @event finish
         * @type {Response} The instance itself
         */
        this._originalResponse.on('finish', () => {
            this.emit('finish', this);
        });
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

        // make sure no stream is registered        
        if (this._streamToPipe !== null) {
            throw new Error('Can not write data when piping data');
        }

        // if the data is a stream, convert it to a buffer
        if (typeof data === 'string') {
            data = new Buffer(data);
        }

        // if the written data is no stream, throw an typeerror
        if (!Buffer.isBuffer(data)) {
            throw new TypeError('Unmatched signature. Please call with (data<string>) or (data<Buffer>)');
        }

        this._sendBufferList.push(data);
        this._sendBufferListLength += data.length;

        return this;
    }

    /**
     * Sets given stream as stream to pipe
     *
     * @param {ReadableStream} aStream The readable stream to pipe
     * @return {this} The instance itself
     */
    pipe(aStream) {
        if (this._sendBufferList.length > 0) {
            throw new Error('Can not pipe a stream when writing data');
        }

        if (this._streamToPipe !== null) {
            throw new Error('There is already a stream set');
        }

        if (aStream instanceof stream.Readable) {
            this._streamToPipe = aStream;
        }
        else {
            throw new TypeError('Unmatched signature. Please call with readable stream');
        }

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

        if (this._streamToPipe !== null) {
            this._originalResponse.pipe(this._streamToPipe);
        }
        else {
            this._originalResponse.write(Buffer.concat(this._sendBufferList, this._sendBufferListLength));
            this._originalResponse.end();
        }

        return this;
    }
}

module.exports = Response;