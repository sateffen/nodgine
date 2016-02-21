/* global describe,expect,it,before,after,Buffer */
'use strict';

const Nodgine = require('../../src/nodgine');
const libHttp = require('http');

describe('End to end functionallity', () => {
    let httpServer = null;
    let instance = null;

    before(() => {
        instance = new Nodgine();
        httpServer = libHttp.createServer(instance.getRouter());

        instance.addMiddleware((aRequest, aResponse) => {
            aResponse
                .setStatusCode(200)
                .setHeader('isTest', 'yes')
                .write('Hello');
        });

        instance.addMiddleware('/test/:testid', (aRequest, aResponse, aParamsHash) => {
            aResponse.write('TestMiddleware' + aParamsHash.testid);
        });

        instance.addController('/test/*', {
            doGet: (aRequest, aResponse) => {
                aResponse.write('GeT');
            },
            doPost: (aRequest, aResponse) => {
                aResponse
                    .setStatusCode(201)
                    .write('PosT');
            }
        });

        instance.addController('/other', (aRequest, aResponse) => {
            aResponse.write('other');
        });

        instance.addController('/async', (aRequest, aResponse) => {
            return new Promise((aResolve) => {
                aResponse.write('async');
                process.nextTick(() => {
                    aResolve();
                });
            });
        });

        httpServer.listen(8765);
    });

    it('should answer correct requesting http://localhost:8765/test/mugglefugg', (done) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8765,
            path: '/test/End2EndTestsAreSoCool',
            method: 'POST'
        };
        const request = libHttp.request(options, (aResponse) => {
            const receivedData = [];
            
            aResponse.on('data', (aChunk) => {
                receivedData.push(aChunk);
            });
            
            aResponse.on('end', () => {
                expect(aResponse.statusCode).to.equal(201);
                // here we expect istest completly lowercase, because nodejs makes everything lowercase
                expect(aResponse.headers.istest).to.equal('yes');
                expect(receivedData.toString()).to.equal('HelloTestMiddlewareEnd2EndTestsAreSoCoolPosT');
                done();
            });
        });
        
        request.on('error', (aError) => {
            // just throw the error to fail the test
            throw aError;
        });
        
        request.end();
    });
    
    it('should answer correct requesting http://localhost:8765/other', (done) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8765,
            path: '/other',
            method: 'GET'
        };
        const request = libHttp.request(options, (aResponse) => {
            const receivedData = [];
            
            aResponse.on('data', (aChunk) => {
                receivedData.push(aChunk);
            });
            
            aResponse.on('end', () => {
                expect(aResponse.statusCode).to.equal(200);
                // here we expect istest completly lowercase, because nodejs makes everything lowercase
                expect(aResponse.headers.istest).to.equal('yes');
                expect(receivedData.toString()).to.equal('Helloother');
                done();
            });
        });
        
        request.on('error', (aError) => {
            // just throw the error to fail the test
            throw aError;
        });
        
        request.end();
    });
    
    it('should answer correct requesting http://localhost:8765/async', (done) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8765,
            path: '/async',
            method: 'GET'
        };
        const request = libHttp.request(options, (aResponse) => {
            const receivedData = [];
            
            aResponse.on('data', (aChunk) => {
                receivedData.push(aChunk);
            });
            
            aResponse.on('end', () => {
                expect(aResponse.statusCode).to.equal(200);
                // here we expect istest completly lowercase, because nodejs makes everything lowercase
                expect(aResponse.headers.istest).to.equal('yes');
                expect(receivedData.toString()).to.equal('Helloasync');
                done();
            });
        });
        
        request.on('error', (aError) => {
            // just throw the error to fail the test
            throw aError;
        });
        
        request.end();
    });
    
    it('should answer with 404 requesting http://localhost:8765/does/not/exist', (done) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8765,
            path: '/does/not/exist',
            method: 'GET'
        };
        const request = libHttp.request(options, (aResponse) => {
            const receivedData = [];
            
            aResponse.on('data', (aChunk) => {
                receivedData.push(aChunk);
            });
            
            aResponse.on('end', () => {
                expect(aResponse.statusCode).to.equal(404);
                // here we expect istest completly lowercase, because nodejs makes everything lowercase
                expect(aResponse.headers.istest).to.equal('yes');
                expect(receivedData.toString()).to.equal('HelloNot Found');
                done();
            });
        });
        
        request.on('error', (aError) => {
            // just throw the error to fail the test
            throw aError;
        });
        
        request.end();
    });
    
    after(() => {
        httpServer.close();
    });
});