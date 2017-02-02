/* global describe,expect,it,beforeEach,Buffer */
'use strict';

const Request = require('../../src/request');

describe('Request', () => {
    let instance = null;
    let mock = null;

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
            }
        };

        instance = new Request({
            request: mock.request,
            parsedUrl: mock.parsedUrl,
            response: {}
        });
    });

    it('should be an instance of Request', () => {
        expect(instance).to.be.an.instanceof(Request);
    });

    it('should return the correct method calling getMethod', () => {
        expect(instance.getMethod()).to.equal(mock.request.method);
    });

    it('should return the body stream calling getBodyStream', () => {
        const bodyStream = instance.getBodyStream();

        expect(bodyStream).to.equal(mock.request);
    });

    it('should return a hash containing all headers calling getAllHeaders', () => {
        const allHeaders = instance.getAllHeaders();

        expect(Object.keys(allHeaders)).to.have.length(Object.keys(mock.request.headers).length);
        Object.keys(mock.request.headers).forEach((aKey) => {
            expect(allHeaders[aKey]).to.equal(mock.request.headers[aKey]);
        });
    });

    it('should return the correct value for a specific header calling getHeader', () => {
        expect(instance.getHeader('testHeader')).to.equal(mock.request.headers.testheader);
    });

    [0, 1, 3.14, -2.7, true, false, () => { }, {}, [], null, undefined].forEach((aValue) => { // eslint-disable-line
        it('should throw an error calling getHeader with first param of type ' + toString.call(aValue), () => {
            expect(() => {
                instance.getHeader(aValue);
            }).to.throw(TypeError);
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
        const queryStringObject = instance.getQueryStringObject();

        expect(Object.keys(queryStringObject)).to.have.length(Object.keys(mock.parsedUrl.query).length);
        Object.keys(mock.parsedUrl.query).forEach((aKey) => {
            expect(queryStringObject[aKey]).to.equal(mock.parsedUrl.query[aKey]);
        });
    });
});