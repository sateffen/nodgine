/* global describe,expect,it,beforeEach,Buffer */
'use strict';

const Request = require('../../src/request');

describe('Request', () => {
    let instance;
    let mock;

    beforeEach(() => {
        mock = {
            request: {
                headers: {
                    testheader: 'yep'
                },
                method: 'GET'
            },
            parsedUrl: {
                auth: 'userand:password',
                protocol: 'maybeHttp',
                pathname: '/I/am/a/path',
                query: {
                    testQuery: 'another yep'
                }
            },
            requestBody: new Buffer('It is only fun if they run')
        };

        instance = new Request(mock.request, mock.requestBody, mock.parsedUrl);
    });

    it('should be an instance of Request', () => {
        expect(instance).to.be.an.instanceof(Request);
    });

    it('should return the correct method calling getMethod', () => {
        expect(instance.getMethod()).to.equal(mock.request.method);
    });

    it('should return the body buffer calling getBody', () => {
        let body = instance.getBody();

        expect(body).to.be.an.instanceof(Buffer);
        expect(body.toString()).to.equal(mock.requestBody.toString());
    });

    it('should return a hash containing all headers calling getAllHeaders', () => {
        let allHeaders = instance.getAllHeaders();

        expect(Object.keys(allHeaders)).to.have.length(Object.keys(mock.request.headers).length);
        Object.keys(mock.request.headers).forEach((aKey) => {
            expect(allHeaders[aKey]).to.equal(mock.request.headers[aKey]);
        });
    });

    it('should return the correct value for a specific header calling getHeader', () => {
        expect(instance.getHeader('testHeader')).to.equal(mock.request.headers.testheader);
    });

    [0, 1, 3.14, -2.7, true, false, () => { }, {}, [], null, undefined].forEach((aValue) => {
        it('should throw an error calling getHeader with first param of type ' + toString.call(aValue), () => {
            function getHeader() {
                instance.getHeader(aValue);
            }
            
            expect(getHeader).to.throw(TypeError);
        });
    });

    it('should return the correct authentication calling getAuthentication', () => {
        expect(instance.getAuthentication()).to.equal(mock.parsedUrl.auth);
    });

    it('should return the correct protocol calling getProtocol', () => {
        expect(instance.getProtocol()).to.equal(mock.parsedUrl.protocol);
    });

    it('should return the correct request path calling getRequestPath', () => {
        expect(instance.getRequestPath()).to.equal(mock.parsedUrl.pathname);
    });

    it('should return a correct querystring object calling getQueryStringObject', () => {
        let queryStringObject = instance.getQueryStringObject();

        expect(Object.keys(queryStringObject)).to.have.length(Object.keys(mock.parsedUrl.query).length);
        Object.keys(mock.parsedUrl.query).forEach((aKey) => {
            expect(queryStringObject[aKey]).to.equal(mock.parsedUrl.query[aKey]);
        });
    });
});