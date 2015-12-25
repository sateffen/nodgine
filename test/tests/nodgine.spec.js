/* global describe,expect,it,beforeEach */
'use strict';

const Nodgine = require('../../src/nodgine');
const Wrapper = require('../../src/wrapper');

describe('Nodgine', () => {
    let instance;

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

    it('should initialize the missing route controller with a function that sends 404 Not Found to the client', () => {
        let request = {};
        let response = {
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

        function callMissingRouteController() {
            instance._missingRouteController(request, response);
        }

        expect(callMissingRouteController).not.to.throw();
        expect(response.statusCode).to.equal(404);
        expect(response.writtenString).to.be.an('string');
        expect(response.writtenString.toString()).to.equal('Not Found');
    });

    it('should add a middleware wrapper to the private list calling addMiddleware', () => {
        function callback() { }
        let route = '/test/it';

        instance.addMiddleware(route, callback);

        expect(instance._middleware).to.have.length(1);
        let wrapper = instance._middleware[0];

        expect(wrapper).to.be.an.instanceof(Wrapper);
        expect(wrapper._callback).to.equal(callback);
        expect(route).to.match(wrapper._routePattern);
    });

    it('should add a middleware wrapper to the private list calling addMiddleware with only a callback', () => {
        function callback() { }

        instance.addMiddleware(callback);

        expect(instance._middleware).to.have.length(1);
        let wrapper = instance._middleware[0];

        expect(wrapper).to.be.an.instanceof(Wrapper);
        expect(wrapper._callback).to.equal(callback);
        expect('/').to.match(wrapper._routePattern);
    });

    it('should set the private variable to given callback calling setMissingRouteController', () => {
        function callback() { }

        instance.setMissingRouteController(callback);
        expect(instance._missingRouteController).to.equal(callback);
    });

    [0, 1, 3.14, -2.7, 'test', true, false, [], {}, undefined, null].forEach((aValue) => {
        it('should throw an error calling setMissingRouteController with param type ' + toString.call(aValue), () => {
            function setMissingRouteController() {
                instance.setMissingRouteController(aValue);
            }

            expect(setMissingRouteController).to.throw(TypeError);
        });
    });

    [0, 1, 3.14, -2.7, true, false, [], {}, undefined, null].forEach((aValue) => {
        it('should throw an error calling addMiddlware with first param type ' + toString.call(aValue), () => {
            function addMiddleware() {
                instance.addMiddleware(aValue, () => { });
            }

            expect(addMiddleware).to.throw(TypeError);
        });
    });

    [0, 1, 3.14, -2.7, true, false, () => { }, [], {}, undefined, null].forEach((aValue) => {
        it('should throw an error calling addController with first param type ' + toString.call(aValue), () => {
            function addController() {
                instance.addController(aValue, () => { });
            }

            expect(addController).to.throw(TypeError);
        });
    });

    [0, 1, 3.14, -2.7, 'test', true, false, [], {}, undefined, null].forEach((aValue) => {
        it('should throw an error calling addMiddlware with second param type ' + toString.call(aValue), () => {
            function addMiddleware() {
                instance.addMiddleware('/*', aValue);
            }

            expect(addMiddleware).to.throw(TypeError);
        });
    });

    [0, 1, 3.14, -2.7, 'test', true, false, [], undefined, null].forEach((aValue) => {
        it('should throw an error calling addController with second param type ' + toString.call(aValue), () => {
            function addController() {
                instance.addController('/*', aValue);
            }

            expect(addController).to.throw(TypeError);
        });
    });

    it('should add a controller wrapper to the private list calling addController', () => {
        function callback() { }
        let route = '/test/it';

        instance.addController(route, callback);

        expect(instance._controller).to.have.length(1);
        let wrapper = instance._controller[0];

        expect(wrapper).to.be.an.instanceof(Wrapper);
        expect(wrapper._callback).to.equal(callback);
        expect(route).to.match(wrapper._routePattern);
    });

    it('should add a controller wrapper to the private list calling addController with an object', () => {
        let servelet = {};
        let route = '/test/it';

        instance.addController(route, servelet);

        expect(instance._controller).to.have.length(1);
        let wrapper = instance._controller[0];

        expect(wrapper).to.be.an.instanceof(Wrapper);
        expect(wrapper._callback).to.be.an('function');
    });

    it('should return a routing function calling getRouter', () => {
        expect(instance.getRouter()).to.be.an('function');
    });

    it('should return a routing function expecting two arguments calling getRouter', () => {
        let router = instance.getRouter();

        expect(router).to.have.length(2);
    });

    it('should run the correct controller calling _runController', () => {
        let calledCorrectController = false;
        let calledWrongController = false;
        let calledCorrectControllerWith = [];

        let request = {
            isRequest: true
        };
        let response = {
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

        console.log(calledCorrectControllerWith);

        expect(calledWrongController).to.equal(false);
        expect(calledCorrectController).to.equal(true);
        expect(calledCorrectControllerWith).to.have.length(3);
        expect(calledCorrectControllerWith[0]).to.equal(request);
        expect(calledCorrectControllerWith[1]).to.equal(response);
        expect(calledCorrectControllerWith[2]).to.be.an('object');
        expect(Object.keys(calledCorrectControllerWith[2])).to.have.length(0);
    });
    
    it('should run all fitting middleware', () => {
        let calledCorrectMiddleware1 = false;
        let calledCorrectMiddleware2 = false;
        let calledWrongMiddleware = false;
        let calledCorrectMiddlewareWith1 = [];
        let calledCorrectMiddlewareWith2 = [];
        
        let request = {
            isRequest: true
        };
        let response = {
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
        
        instance._runMiddleware('/ok', request, response);
        
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
        expect(calledCorrectMiddlewareWith2[2]).to.be.an('object');
        expect(Object.keys(calledCorrectMiddlewareWith2[2])).to.have.length(0);
    });
});