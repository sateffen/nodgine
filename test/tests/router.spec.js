'use strict';
var chai = require('chai'),
    expect = chai.expect,
    mPath = require('path'),
    mRouter = require('../../src/bootstrap.js').$ROUTER;

describe('The router should work as intended', function () {
    var notAString = [0, 1, 123, 3.14, -15, true, false, null, undefined, [], {}, function () {}],
        notValidDefaultControllerTypes = [0, 1, 123, 3.14, -15, 'test', true, false, '', null, undefined, [], {}],
        notValidRouteControllerTypes = [0, 1, 123, 3.14, -15, 'test', true, false, '', null, undefined, []],
        validDefaultController = function (aReq, aRes) {
            aRes.writeHead(204);
            aRes.end('DEFAULTCONTROLLER');
        },
        validPreProcessor = function (aRequest, aResponse, aArgs, aCallback) {
            aCallback();
        },
        validPostProcessor = function (aRequest, aResponse, aArgs, aCallback) {
            aCallback();
        },
        hiddenRoute = function (aReq, aRes) {
            aRes.writeHead('202');
            aRes.write('this is hidden');
        };

    after(function(aCallback) {
        mRouter.clearRoutes();

        aCallback();
    });

    it('should return null getting the default route without any set', function () {
        var defaultRoute;
        function getDefaultRoute() {
            defaultRoute = mRouter.getDefaultRoute();
        }

        expect(getDefaultRoute).not.to.throw();
        expect(defaultRoute).to.be.null();
    });

    notValidDefaultControllerTypes.forEach(function (notValidValue) {
        it('should throw an error setting ' + notValidValue + ' as default function', function () {
            function setDefaultRoute() {
                mRouter.setDefaultRoute(notValidValue);
            }

            expect(setDefaultRoute).to.throw();
        });
    });

    it('should set a valid default controller', function () {
        function setDefaultRoute() {
            mRouter.setDefaultRoute(validDefaultController);
        }

        expect(setDefaultRoute).not.to.throw();
    });

    it('should contain the set default controller after setting it', function () {
        var defaultController = mRouter.getDefaultRoute();

        expect(defaultController).to.equal(validDefaultController);
    });

    notValidDefaultControllerTypes.forEach(function (notValidValue) {
        it('should throw an error adding ' + notValidValue + ' to preprocessors', function () {
            function addPreProcessor() {
                mRouter.addPreProcessor(notValidValue);
            }

            expect(addPreProcessor).to.throw();
        });

        it('should throw an error adding ' + notValidValue + ' to postprocessors', function () {
            function addPostProcessor() {
                mRouter.addPostProcessor(notValidValue);
            }

            expect(addPostProcessor).to.throw();
        });
    });

    it('should not throw an error adding a valid preprocessor', function () {
        function addPreProcessor() {
            mRouter.addPreProcessor(validPreProcessor);
        }

        expect(addPreProcessor).not.to.throw();
    });

    it('should not throw an error adding a valid postprocessor', function () {
        function addPostProcessor() {
            mRouter.addPostProcessor(validPostProcessor);
        }

        expect(addPostProcessor).not.to.throw();
    });

    notValidRouteControllerTypes.forEach(function (notValidController) {
        it('should throw an error when second param is ' + notValidController + ' and not a valid route-controller', function () {
            function addRoute() {
                mRouter.addRoute('/test', notValidController);
            }

            expect(addRoute).to.throw();
        });
    });

    it('should work when setting a correct router', function () {
        function addRoute() {
            mRouter.addRoute('/hidden/test/route', hiddenRoute);
        }

        expect(addRoute).not.to.throw();
    });

    notAString.forEach(function(value) {
        it('should throw an error to call getRoute with ' + value, function () {
            function getRoute() {
                mRouter.getRoute(value);
            }

            expect(getRoute).to.throw();
        });
    });

    it('should return null for a not existing route', function () {
        var returnValue;
        function getRoute() {
            returnValue = mRouter.getRoute('/test/that/not/exists');
        }

        expect(getRoute).not.to.throw();
        expect(returnValue).to.be.null();
    });

    it('should work when getting a router', function () {
        var hidden;
        function addRoute() {
            hidden = mRouter.getRoute('/hidden/test/route');
        }

        expect(addRoute).not.to.throw();
        expect(hidden).to.be.an('object');
        expect(hidden.callback).to.equal(hiddenRoute);
    });

    notAString.forEach(function (value) {
        it('should throw an error when first param in addRoute is not a string, but ' + value, function () {
            function addRoute() {
                mRouter.addRoute(value, function () {});
            }

            expect(addRoute).to.throw();
        });
    });
});
