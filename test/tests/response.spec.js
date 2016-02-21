/* global describe,expect,it,Buffer,beforeEach */
'use strict';

const Response = require('../../src/response');

describe('Response', () => {
    let instance = null;
    let mock = null;

    beforeEach(() => {
        mock = {
            __statusCode: undefined,
            __header: undefined,
            __writtenBuffers: [],
            __hasEnded: false,
            writeHead: (aStatusCode, aHeader) => {
                mock.__statusCode = aStatusCode;
                mock.__header = aHeader;
            },
            write: (aBuffer) => {
                mock.__writtenBuffers.push(aBuffer);
            },
            end: () => {
                mock.__hasEnded = true;
            }
        };
        instance = new Response({
            request: {},
            requestBody: new Buffer('I am a buffer'),
            parsedUrl: {},
            response: mock
        });
    });

    it('should be of instance Response', () => {
        expect(instance).to.be.an.instanceof(Response);
    });

    it('should initialize the private variable for status code with 200', () => {
        expect(instance._statusCode).to.equal(200);
    });

    it('should set the statuscode to the private variable calling setStatusCode', () => {
        instance.setStatusCode(404);
        expect(instance._statusCode).to.equal(404);

        instance.setStatusCode(500);
        expect(instance._statusCode).to.equal(500);
    });

    [3.14, -2.7, 'test', true, false, () => { }, {}, [], null, undefined].forEach((aValue) => { // eslint-disable-line
        it('should throw an error calling setStatusCode with non integer param type ' + toString.call(aValue), () => {
            expect(() => {
                instance.setStatusCode(aValue);
            }).to.throw(TypeError);
        });
    });

    it('should get the statuscode from the private variable calling getStatusCode', () => {
        expect(instance.getStatusCode()).to.equal(instance._statusCode);
        instance._statusCode = 404;
        expect(instance.getStatusCode()).to.equal(instance._statusCode);
        instance._statusCode = 500;
        expect(instance.getStatusCode()).to.equal(instance._statusCode);
    });

    it('should have an empty private variable for the written chunks', () => {
        expect(instance._sendBufferList).to.have.length(0);
    });

    it('should save the written chunks as buffers in the private variable calling write', () => {
        const bufferToWrite1 = new Buffer('I am a unittest');
        const bufferToWrite2 = new Buffer('I am a second unittest');

        instance.write(bufferToWrite1);
        instance.write(bufferToWrite2);

        expect(instance._sendBufferList).to.have.length(2);
        expect(instance._sendBufferList[0]).to.be.an.instanceof(Buffer);
        expect(instance._sendBufferList[0]).to.equal(bufferToWrite1);
        expect(instance._sendBufferList[1]).to.be.an.instanceof(Buffer);
        expect(instance._sendBufferList[1]).to.equal(bufferToWrite2);
    });

    it('should convert strings to buffers and write them to the private variable calling write', () => {
        const stringToWrite1 = 'I am a unittest';
        const stringToWrite2 = 'I am another unittest';

        instance.write(stringToWrite1);
        instance.write(stringToWrite2);

        expect(instance._sendBufferList).to.have.length(2);
        expect(instance._sendBufferList[0]).to.be.an.instanceof(Buffer);
        expect(instance._sendBufferList[0].toString()).to.equal(stringToWrite1);
        expect(instance._sendBufferList[1]).to.be.an.instanceof(Buffer);
        expect(instance._sendBufferList[1].toString()).to.equal(stringToWrite2);
    });

    [3.14, -2.7, 0, 1, true, false, () => { }, {}, [], null, undefined].forEach((aValue) => { // eslint-disable-line
        it('should throw an error calling write with param of type ' + toString.call(aValue), () => {
            expect(() => {
                instance.write(aValue);
            }).to.throw(TypeError);
        });
    });

    it('should initialize with an empty private variable for headers', () => {
        expect(Object.keys(instance._headerHash)).to.have.length(0);
    });

    it('should write a header to the private variable calling setHeader', () => {
        instance.setHeader('my-super-header', 'has-a-super-value');

        expect(Object.keys(instance._headerHash)).to.have.length(1);
        expect(instance._headerHash['my-super-header']).to.equal('has-a-super-value');
    });

    [3.14, -2.7, 0, 1, true, false, () => { }, {}, [], null, undefined].forEach((aValue) => { // eslint-disable-line
        it('should throw an error calling setHeader with first param as type ' + toString.call(aValue), () => {
            expect(() => {
                instance.setHeader(aValue, 'has-a-super-value');
            }).to.throw(TypeError);
        });

        it('should throw an error calling setHeader with second param as type ' + toString.call(aValue), () => {
            expect(() => {
                instance.setHeader('my-super-header', aValue);
            }).to.throw(TypeError);
        });

        it('should throw an error calling setHeader with both params as type ' + toString.call(aValue), () => {
            expect(() => {
                instance.setHeader(aValue, aValue);
            }).to.throw(TypeError);
        });
    });

    it('should return the correct header value from private variable calling getHeader', () => {
        instance._headerHash['my-super-header'] = 'has-a-super-value';

        expect(instance.getHeader('my-super-header')).to.equal('has-a-super-value');
    });

    it('should return true if the header exists in private variable calling hasHeader', () => {
        instance._headerHash['my-super-header'] = 'has-a-super-value';

        expect(instance.hasHeader('my-super-header')).to.equal(true);
    });

    it('should return false if the header does not exist in private variable calling hasHeader', () => {
        expect(instance.hasHeader('my-super-header')).to.equal(false);
    });

    it('should remove the header from private variable calling removeHeader', () => {
        instance._headerHash['my-super-header'] = 'has-a-super-value';

        instance.removeHeader('my-super-header');
        expect(instance._headerHash['my-super-header']).to.equal(undefined);
    });

    it('should write all private data correctly to the respond calling flush', () => {
        instance.write('Not Found');
        instance.setStatusCode(404);
        instance.setHeader('Rammus', 'Ok!');
        instance.flush();

        expect(mock.__statusCode).to.equal(404);
        expect(Object.keys(mock.__header)).to.have.length(1);
        expect(mock.__header.rammus).to.equal('Ok!');
        expect(mock.__hasEnded).to.equal(true);
    });

    it('should throw an error calling flush twice', () => {
        expect(() => {
            instance.flush();
            instance.flush();
        }).to.throw(Error);
    });
});