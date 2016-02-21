/* global describe,expect,it,beforeEach,Buffer */
'use strict';

const Nodgine = require('../../src/nodgine');
const Wrapper = require('../../src/wrapper');
const Request = require('../../src/request');
const Response = require('../../src/response');
const libChai = require('chai');
const libEvents = require('events');

describe('Nodgine', () => {
    let instance = null;

    beforeEach(() => {
        instance = new Nodgine();
    });

    it('should be an instance of nodgine', () => {
        expect(instance).to.be.an.instanceof(Nodgine);
    });

    it('should initialize with an empty middleware list', () => {
        expect(instance._middleware).to.have.length(0);
    });

    it('should initialize with an empty controller list', () => {
        expect(instance._controller).to.have.length(0);
    });

    it('should initialize the missing route controller with an function', () => {
        expect(instance._missingRouteController).to.be.an('function');
    });

    it('should initialize the request class pointer with the correct default value', () => {
        expect(instance._requestClass).to.equal(Request);
    });

    it('should initialize the response class pointer with the correct default value', () => {
        expect(instance._responseClass).to.equal(Response);
    });

    it('should initialize the request class with the provided params constructor', () => {
        class testRequest { }
        const testInstance = new Nodgine({
            requestClass: testRequest
        });

        expect(testInstance._requestClass).to.equal(testRequest);
    });

    it('should initialize the response class with the provided params constructor', () => {
        class testResponse { }
        const testInstance = new Nodgine({
            responseClass: testResponse
        });

        expect(testInstance._responseClass).to.equal(testResponse);
    });

    it('should initialize the request and response class correctly if bothi is provided as constructor params', () => {
        class testRequest { }
        class testResponse { }
        const testInstance = new Nodgine({
            requestClass: testRequest,
            responseClass: testResponse
        });

        expect(testInstance._requestClass).to.equal(testRequest);
        expect(testInstance._responseClass).to.equal(testResponse);
    });

    [0, 1, 3.14, -2.7, 'test', true, false, [], {}, undefined, null].forEach((aValue) => {
        it('should not initialize the request class is the parameter is of type ' + toString.call(aValue), () => {
            const testInstance = new Nodgine({
                requestClass: aValue
            });
            
            expect(testInstance._requestClass).not.to.equal(aValue);
        });
        
        it('should not initialize the response class is the parameter is of type ' + toString.call(aValue), () => {
            const testInstance = new Nodgine({
                responseClass: aValue
            });
            
            expect(testInstance._responseClass).not.to.equal(aValue);
        });
    });

    it('should initialize the missing route controller with a function that sends 404 Not Found to the client', () => {
        const request = {};
        const response = {
            writtenString: undefined,
            statusCode: 0,
            write: (aBuffer) => {
                response.writtenString = aBuffer;
                return response;
            },
            setStatusCode: (aStatusCode) => {
                response.statusCode = aStatusCode;
                return response;
            }
        };

        expect(() => {
            instance._missingRouteController(request, response);
        }).not.to.throw();
        expect(response.statusCode).to.equal(404);
        expect(response.writtenString).to.be.an('string');
        expect(response.writtenString.toString()).to.equal('Not Found');
    });

    it('should add a middleware wrapper to the private list calling addMiddleware', () => {
        function callback() { } // eslint-disable-line
        const route = '/test/it';

        instance.addMiddleware(route, callback);

        expect(instance._middleware).to.have.length(1);
        const wrapper = instance._middleware[0];

        expect(wrapper).to.be.an.instanceof(Wrapper);
        expect(wrapper._callback).to.equal(callback);
        expect(route).to.match(wrapper._routePattern);
    });

    it('should add a middleware wrapper to the private list calling addMiddleware with only a callback', () => {
        function callback() { } // eslint-disable-line

        instance.addMiddleware(callback);

        expect(instance._middleware).to.have.length(1);
        const wrapper = instance._middleware[0];

        expect(wrapper).to.be.an.instanceof(Wrapper);
        expect(wrapper._callback).to.equal(callback);
        expect('/').to.match(wrapper._routePattern);
    });

    it('should set the private variable to given callback calling setMissingRouteController', () => {
        function callback() { } // eslint-disable-line
        
        instance.setMissingRouteController(callback);
        expect(instance._missingRouteController).to.equal(callback);
    });

    [0, 1, 3.14, -2.7, 'test', true, false, [], {}, undefined, null].forEach((aValue) => {
        it('should throw an error calling setMissingRouteController with param type ' + toString.call(aValue), () => {
            expect(() => {
                instance.setMissingRouteController(aValue);
            }).to.throw(TypeError);
        });
    });

    [0, 1, 3.14, -2.7, true, false, [], {}, undefined, null].forEach((aValue) => {
        it('should throw an error calling addMiddlware with first param type ' + toString.call(aValue), () => {
            expect(() => {
                instance.addMiddleware(aValue, () => { }); // eslint-disable-line
            }).to.throw(TypeError);
        });
    });

    [0, 1, 3.14, -2.7, true, false, () => { }, [], {}, undefined, null].forEach((aValue) => { // eslint-disable-line
        it('should throw an error calling addController with first param type ' + toString.call(aValue), () => {
            expect(() => {
                instance.addController(aValue, () => { }); // eslint-disable-line
            }).to.throw(TypeError); 
        });
    });

    [0, 1, 3.14, -2.7, 'test', true, false, [], {}, undefined, null].forEach((aValue) => {
        it('should throw an error calling addMiddlware with second param type ' + toString.call(aValue), () => {
            expect(() => {
                instance.addMiddleware('/*', aValue);
            }).to.throw(TypeError);
        });
    });

    [0, 1, 3.14, -2.7, 'test', true, false, [], undefined, null].forEach((aValue) => {
        it('should throw an error calling addController with second param type ' + toString.call(aValue), () => {
            expect(() => {
                instance.addController('/*', aValue);
            }).to.throw(TypeError);
        });
    });

    it('should add a controller wrapper to the private list calling addController', () => {
        function callback() { } // eslint-disable-line
        const route = '/test/it';

        instance.addController(route, callback);

        expect(instance._controller).to.have.length(1);
        const wrapper = instance._controller[0];

        expect(wrapper).to.be.an.instanceof(Wrapper);
        expect(wrapper._callback).to.equal(callback);
        expect(route).to.match(wrapper._routePattern);
    });

    it('should add a controller wrapper to the private list calling addController with an object', () => {
        const servelet = {};
        const route = '/test/it';

        instance.addController(route, servelet);

        expect(instance._controller).to.have.length(1);
        const wrapper = instance._controller[0];

        expect(wrapper).to.be.an.instanceof(Wrapper);
        expect(wrapper._callback).to.be.an('function');
    });

    it('should return a routing function calling getRouter', () => {
        expect(instance.getRouter()).to.be.an('function');
    });

    it('should return a routing function expecting two arguments calling getRouter', () => {
        const router = instance.getRouter();

        expect(router).to.have.length(2);
    });

    it('should run the correct controller calling _runController', () => {
        let calledCorrectController = false;
        let calledWrongController = false;
        let calledCorrectControllerWith = [];

        const request = {
            isRequest: true
        };
        const response = {
            isResponse: true
        };

        instance.addController('/wrong', () => {
            calledWrongController = true;
        });
        instance.addController('/ok', function () {
            calledCorrectController = true;
            calledCorrectControllerWith = Array.prototype.slice.call(arguments);
        });

        instance._runController('/ok', request, response);

        expect(calledWrongController).to.equal(false);
        expect(calledCorrectController).to.equal(true);

        expect(calledCorrectControllerWith).to.have.length(3);
        expect(calledCorrectControllerWith[0]).to.equal(request);
        expect(calledCorrectControllerWith[1]).to.equal(response);
        expect(calledCorrectControllerWith[2]).to.be.an('object');
        expect(Object.keys(calledCorrectControllerWith[2])).to.have.length(0);
    });

    it('should run the _missingRouteController if no other controller was found', () => {
        let callbackWasCalled = false;
        let callbackWasCalledWith = [];
        const request = {};
        const response = {};

        function callback() { // eslint-disable-line
            callbackWasCalled = true;
            callbackWasCalledWith = Array.prototype.slice.call(arguments);
        }

        instance.setMissingRouteController(callback);
        instance._runController('/does/not/exist', request, response);

        expect(callbackWasCalled).to.equal(true);
        expect(callbackWasCalledWith).to.have.length(2);
        expect(callbackWasCalledWith[0]).to.equal(request);
        expect(callbackWasCalledWith[1]).to.equal(response);
    });

    it('should _runMiddleware return a promise', () => {
        instance.addMiddleware(() => { }); // eslint-disable-line
        const result = instance._runMiddleware('/ok', {}, {});

        expect(result).to.be.an.instanceof(Promise);
    });

    it('should run all fitting middleware', (done) => {
        let calledCorrectMiddleware1 = false;
        let calledCorrectMiddleware2 = false;
        let calledWrongMiddleware = false;
        let calledCorrectMiddlewareWith1 = [];
        let calledCorrectMiddlewareWith2 = [];

        const request = {
            isRequest: true
        };
        const response = {
            isResponse: true
        };

        instance.addMiddleware('/wrong', () => {
            calledWrongMiddleware = true;
        });
        instance.addMiddleware('/ok', function () {
            calledCorrectMiddleware1 = true;
            calledCorrectMiddlewareWith1 = Array.prototype.slice.call(arguments);
        });
        instance.addMiddleware(function () {
            calledCorrectMiddleware2 = true;
            calledCorrectMiddlewareWith2 = Array.prototype.slice.call(arguments);
        });

        const runPromise = instance._runMiddleware('/ok', request, response);

        runPromise
            .then(() => {
                expect(calledWrongMiddleware).to.equal(false);
                expect(calledCorrectMiddleware1).to.equal(true);
                expect(calledCorrectMiddleware2).to.equal(true);

                expect(calledCorrectMiddlewareWith1).to.have.length(3);
                expect(calledCorrectMiddlewareWith1[0]).to.equal(request);
                expect(calledCorrectMiddlewareWith1[1]).to.equal(response);
                expect(calledCorrectMiddlewareWith1[2]).to.be.an('object');
                expect(Object.keys(calledCorrectMiddlewareWith1[2])).to.have.length(0);

                expect(calledCorrectMiddlewareWith2).to.have.length(3);
                expect(calledCorrectMiddlewareWith2[0]).to.equal(request);
                expect(calledCorrectMiddlewareWith2[1]).to.equal(response);

                done();
            })
            .catch(() => {
                expect('This should not happen').to.equal(true);
                done();
            });
    });

    it('should register event handler for data and end events on the request while executing the router', () => {
        const router = instance.getRouter();
        const request = new libEvents.EventEmitter();
        const response = {};

        router(request, response);

        expect(request.listeners('data')).to.have.length(1);
        expect(request.listeners('end')).to.have.length(1);
    });

    it('should call _runMiddleware and _runController with the correct parameters while executing the router', (done) => {
        let runMiddlewareWith = [];
        let runControllerWith = [];
        const router = instance.getRouter();
        const executionList = [];
        const requestMock = new libEvents.EventEmitter();
        const responseMock = {
            __wroteHead: false,
            __wroteData: false,
            __endedStream: false,
            writeHead: () => {
                responseMock.__wroteHead = true;
            },
            write: () => {
                responseMock.__wroteData = true;
            },
            end: () => {
                responseMock.__endedStream = true;
            }
        };

        requestMock.url = '/ok';

        instance._runMiddleware = libChai.spy(function () {
            executionList.push(instance._runMiddleware);
            runMiddlewareWith = Array.prototype.slice.call(arguments);
        });
        instance._runController = libChai.spy(function () {
            executionList.push(instance._runController);
            runControllerWith = Array.prototype.slice.call(arguments);
        });

        router(requestMock, responseMock);

        requestMock.emit('data', new Buffer('Hello'));
        requestMock.emit('data', new Buffer(' '));
        requestMock.emit('data', new Buffer('World'));
        const endCallback = requestMock.listeners('end')[0];

        endCallback()
            .then(() => {
                expect(instance._runMiddleware).to.have.been.called();
                expect(instance._runController).to.have.been.called();

                expect(executionList[0]).to.equal(instance._runMiddleware);
                expect(executionList[1]).to.equal(instance._runController);

                expect(responseMock.__wroteHead).to.equal(true);
                expect(responseMock.__wroteData).to.equal(true);
                expect(responseMock.__endedStream).to.equal(true);

                expect(runMiddlewareWith[0]).to.equal('/ok');
                expect(runMiddlewareWith[1]).to.be.an.instanceof(Request);
                expect(runMiddlewareWith[2]).to.be.an.instanceof(Response);

                expect(runControllerWith[0]).to.equal('/ok');
                expect(runControllerWith[1]).to.be.an.instanceof(Request);
                expect(runControllerWith[2]).to.be.an.instanceof(Response);

                expect(runMiddlewareWith[1].getBody().toString()).to.equal('Hello World');

                done();
            })
            .catch(() => {
                expect('this not to happen').to.equal(true);
                done();
            });
    });

    it('should send statuscode 500 if any part of the server has an error', (done) => {
        const router = instance.getRouter();
        const requestMock = new libEvents.EventEmitter();
        const responseMock = {
            __statusCode: 0,
            __endedStream: false,
            writeHead: (aStatusCode) => {
                responseMock.__statusCode = aStatusCode;
            },
            write: () => { }, // eslint-disable-line
            end: () => {
                responseMock.__endedStream = true;
            }
        };

        requestMock.url = '/ok';

        instance._runMiddleware = libChai.spy(() => {
            throw Error();
        });
        instance._runController = libChai.spy();

        router(requestMock, responseMock);

        const endCallback = requestMock.listeners('end')[0];

        endCallback()
            .then(() => {
                expect('this not to happen').to.equal(true);

                done();
            })
            .catch(() => {
                expect(responseMock.__statusCode).to.equal(500);
                expect(responseMock.__endedStream).to.equal(true);

                done();
            });
    });

    it('should do nothing if the request was already finished', (done) => {
        const router = instance.getRouter();
        const requestMock = new libEvents.EventEmitter();
        const responseMock = {
            __wroteHead: false,
            __wroteData: false,
            __endedStream: false,
            writeHead: () => {
                responseMock.__wroteHead = true;
            },
            write: () => {
                responseMock.__wroteData = true;
            },
            end: () => {
                responseMock.__endedStream = true;
            },
            finished: true
        };

        requestMock.url = '/ok';

        instance._runMiddleware = libChai.spy(() => {
            throw Error();
        });
        instance._runController = libChai.spy();

        router(requestMock, responseMock);

        const endCallback = requestMock.listeners('end')[0];

        endCallback()
            .then(() => {
                expect('this not to happen').to.equal(true);

                done();
            })
            .catch(() => {
                expect(responseMock.__wroteHead).to.equal(false);
                expect(responseMock.__wroteData).to.equal(false);
                expect(responseMock.__endedStream).to.equal(false);

                done();
            });
    });
});