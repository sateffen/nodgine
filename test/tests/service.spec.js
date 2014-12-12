'use strict';
var expect = require('chai').expect,
    mPath = require('path'),
    mService = require('../../src/bootstrap.js').$SERVICE;

describe('The $SERVICE should work as intended', function () {
    var service1 = function () { return 'func1'; },
        service2 = function () { return 'func2'; },
        service3 = {test: true, type: 'an object'},
        notStrings = [123, 12.34, -15, [], {}, undefined, null, true, false, function () {}],
        notServices = ['test', 'string', 123, 12.34, -15, [], undefined, null, true, false];

    it('should work registering services', function (done) {
        function doRegister() {
            mService.registerService('myFunction1', 'aFunction', service1);
            mService.registerService('myFunction2', 'aFunction', service2);
            mService.registerService('myObject', 'anObject', service3);
        }

        mService.once('serviceRegistered', function (type, id) {
            expect(type).to.equal('aFunction');
            expect(id).to.equal('myFunction1');

            done();
        });

        expect(doRegister).not.to.throw();
    });

    it('should throw an error when a service with specified id already exists', function () {
        function doRegister() {
            mService.registerService('myFunction1', 'aFunction', function() { return 'invalid service'; });
        }

        expect(doRegister).to.throw();
    });

    it('should return an array containing all correct services getting them by type "aFunction"', function () {
        var services = mService.getServicesByType('aFunction');

        expect(services).to.be.an('array');
        expect(services.length).to.equal(2);
        expect(services[0]).to.equal(service1);
        expect(services[1]).to.equal(service2);
    });

    it('should return an array containing all correct services getting them by type "anObject"', function () {
        var services = mService.getServicesByType('anObject');

        expect(services).to.be.an('array');
        expect(services.length).to.equal(1);
        expect(services[0]).to.equal(service3);
    });

    it('should return the correct service getting it by myFunction1', function () {
        var service = mService.getServiceById('myFunction1');

        expect(service).to.be.a('function');
        expect(service).to.equal(service1);
    });

    it('should return the correct service getting it by myFunction1', function () {
        var service = mService.getServiceById('myFunction2');

        expect(service).to.be.a('function');
        expect(service).to.equal(service2);
    });

    it('should return the correct service getting it by myObject', function () {
        var service = mService.getServiceById('myObject');

        expect(service).to.be.an('object');
        expect(service).to.equal(service3);
    });

    it('should remove the service with given id correctly', function (done) {
        function doUnregister() {
            mService.unregisterService('myFunction2');
        }

        mService.once('serviceUnregistered', function (type, id) {
            expect(type).to.equal('aFunction');
            expect(id).to.equal('myFunction2');

            done();
        });

        expect(doUnregister).not.to.throw();
    });

    it('should only contain one service of type "aFunction" anymore', function () {
        var services = mService.getServicesByType('aFunction');

        expect(services).to.be.an('array');
        expect(services.length).to.equal(1);
        expect(services[0]).to.equal(service1);
    });

    it('should clear all services on call', function (done) {
        mService.once('servicesCleared', function () {
            var ser1 = mService.getServiceById('myFunction1'),
                ser3 = mService.getServiceById('myObject');

            expect(ser1).to.be.undefined();
            expect(ser3).to.be.undefined();

            done();
        });

        mService.clearServices();
    });

    it('should throw an error when passing a not string as id', function () {
        notStrings.forEach(function (id) {
            function doRegister() {
                mService.registerService(id, 'type', function () { return 'a service'; });
            }

            expect(doRegister).to.throw();
        });
    });

    it('should throw an error when passing a not string as type', function () {
        notStrings.forEach(function (type) {
            function doRegister() {
                mService.registerService('id', type, function () { return 'a service'; });
            }

            expect(doRegister).to.throw();
        });
    });

    it('should throw an error when passing a not valid service as service', function () {
        notServices.forEach(function (service) {
            function doRegister() {
                mService.registerService('id', 'type', service);
            }

            expect(doRegister).to.throw();
        });
    });

    it('should throw an error when passing not an id to getServiceById', function () {
        notStrings.forEach(function (id) {
            function doGet() {
                mService.getServiceById(id);
            }

            expect(doGet).to.throw();
        });
    });

    it('should throw an error when passing not an id to getServicesByType', function () {
        notStrings.forEach(function (type) {
            function doGet() {
                mService.getServicesByType(type);
            }

            expect(doGet).to.throw();
        });
    });
});
