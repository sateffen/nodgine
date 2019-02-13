'use strict';

/**
 * A request object wrapper
 */
class Request {
    /**
     * Constructor for the request object wrapper
     * This gets the parsed result for the url object, because we want to reuse the same object
     * And save every cycle
     *
     * @param {Object} aParamsObject A params object that contains all request related params
     */
    constructor(aParamsObject) {
        /**
         * A pointer to the original request object
         *
         * @private
         * @member {NodeHttpRequest}
         */
        this._originalRequest = aParamsObject.request;

        /**
         * A pointer to the parsed url object result
         *
         * @private
         * @member {NodeParsedUrlObject}
         */
        this._parsedUrl = aParamsObject.parsedUrl;
    }

    /**
     * Returns the method of this object
     *
     * @return {String} The method
     */
    getMethod() {
        return this._originalRequest.method;
    }

    /**
     * Returns the request body
     *
     * @return {ReadableStream} The request body stream
     */
    getBodyStream() {
        return this._originalRequest;
    }

    /**
     * Returns an object containing all header received
     *
     * @return {Object} The header hash
     */
    getAllHeaders() {
        return this._originalRequest.headers;
    }

    /**
     * Returns the value for given header
     *
     * @param {String} aHeaderName The header to receive the value from
     * @return {String} The header value
     */
    getHeader(aHeaderName) {
        if (typeof aHeaderName !== 'string') {
            throw new TypeError('Unmatched signature. Please call with (headername<string>)');
        }

        return this._originalRequest.headers[aHeaderName.toLowerCase()];
    }

    /**
     * Gets the http authentication part of the current request
     *
     * @return {String} The authentication string
     * @example
     * So for the url http://user:pass@example.com it would return "user:pass"
     */
    getAuthentication() {
        return this._parsedUrl.auth;
    }

    /**
     * Returns the protocol of current request
     *
     * @return {String} The protocol of current request
     * @example
     * So for the url http://user:pass@example.com it would return "http:"
     */
    getProtocol() {
        return this._parsedUrl.protocol;
    }

    /**
     * Returns the request path of current request
     *
     * @return {String} The path for current request
     * @example
     * So for the url http://user:pass@example.com/test it would return "/test"
     */
    getRequestPath() {
        return this._parsedUrl.pathname;
    }

    /**
     * Returns an object telling the query string for the current request
     *
     * @return {Object} The query parameters for the current request
     * @example
     * So for the url http://user:pass@example.com?test=it&pi=3.14 it would return {test: 'it', pi: '3.14'}
     */
    getQueryStringObject() {
        return this._parsedUrl.query;
    }
}

module.exports = Request;
