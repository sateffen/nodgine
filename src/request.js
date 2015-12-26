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
     * @param {NodeHttpRequest} aRequest The original request object to wrap
     * @param {Buffer} A buffer containing the received body data
     * @param {NodeParsedUrlObject} An object that was the result of using require('url').parse(originalRequest.url)
     */
    constructor(aRequest, aRequestBody, aParsedUrl) {
        /**
         * A pointer to the original request object
         *
         * @private
         * @member {NodeHttpRequest}
         */
        this._originalRequest = aRequest;
        
        /**
         * A pointer to the parsed url object result
         *
         * @private
         * @member {NodeParsedUrlObject}
         */
        this._parsedUrl = aParsedUrl;
        
        /**
         * The body buffer
         *
         * @private
         * @member {Buffer}
         */
        this._requestBody = aRequestBody;
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
     * @return {Buffer}
     */
    getBody() {
        return this._requestBody;
    }
    
    /**
     * Returns an object containing all header received
     *
     * @return {Object}
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