'use strict';

class Request {
    constructor(aRequest, aRequestBody, aParsedUrl) {
        this._originalRequest = aRequest;
        this._parsedUrl = aParsedUrl;
        this._requestBody = aRequestBody;
    }
    
    getMethod() {
        return this._originalRequest.method;
    }
    
    getBody() {
        return this._requestBody;
    }
    
    getAllHeaders() {
        return this._originalRequest.headers;
    }
    
    getHeader(aHeaderName) {
        if (typeof aHeaderName !== 'string') {
            throw new TypeError('Unmatched signature. Please call with (headername<string>)');
        }
        
        return this._originalRequest.headers[aHeaderName.toLowerCase()];
    }
    
    getAuthentication() {
        return this._parsedUrl.auth;
    }
    
    getProtocol() {
        return this._parsedUrl.protocol;
    }
    
    getRequestPath() {
        return this._parsedUrl.pathname;
    }
    
    getQueryStringObject() {
        return this._parsedUrl.query;
    }
}

module.exports = Request;