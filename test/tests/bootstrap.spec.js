'use strict';
/* global $APPLICATION, $SERVICE, $ROUTER */
var expect = require('chai').expect,
    mPath = require('path');

describe('Requiring the nodgine should deliver a working object', function () {
    var nodgine = require('../../src/bootstrap.js');

    it('should be requireable as node module', function () {
        function doRequire() {
            var rNodgine = require('../../');

            expect(rNodgine).to.be.an('object');
            expect(rNodgine).to.equal(nodgine);
        }

        expect(doRequire).not.to.throw(doRequire);
    });

    it('should contain the four main objects', function () {
        expect(nodgine.$APPLICATION).to.be.an('object');
        expect(nodgine.$LOGGER).to.be.an('object');
        expect(nodgine.$ROUTER).to.be.an('object');
        expect(nodgine.$SERVICE).to.be.an('object');
    });

    it('should not globalize the four main objects without the call', function () {
        expect(global.$APPLICATION).to.be.undefined();
        expect(global.$LOGGER).to.be.undefined();
        expect(global.$ROUTER).to.be.undefined();
        expect(global.$SERVICE).to.be.undefined();
    });

    it('should globalize the four main objects on call', function () {
        nodgine.globalize();

        expect(global.$APPLICATION).to.be.an('object');
        expect(global.$LOGGER).to.be.an('object');
        expect(global.$ROUTER).to.be.an('object');
        expect(global.$SERVICE).to.be.an('object');

        expect(global.$APPLICATION).to.equal(nodgine.$APPLICATION);
        expect(global.$LOGGER).to.equal(nodgine.$LOGGER);
        expect(global.$ROUTER).to.equal(nodgine.$ROUTER);
        expect(global.$SERVICE).to.equal(nodgine.$SERVICE);
    });

    it('should throw an error when trying to load a file that does not exist', function () {
        function load() {
            nodgine.loadFromFile('iDontExist.json');
        }

        expect(load).to.throw();
    });

    it('should throw an error when loading a not valid json file', function () {
        function load() {
                nodgine.loadFromFile(mPath.resolve(__dirname, './loadfromfile/testservice.js'));
            }

            expect(load).to.throw();
    });

    it('should throw an error when passing the wrong parameter type to loadFromFile', function () {
        var data = [0, 1, 3.14, -5, [], {}, undefined, null];
        function load(value) {
            nodgine.loadFromFile(value);
        }

        data.forEach(function (value) {
            expect(load.bind(null, value)).to.throw();
        });
    });

    describe('Loading the testnodgine.json should result in a working server', function () {
        global.$APPLICATION = undefined;
        global.$LOGGER = undefined;
        global.$ROUTER = undefined;
        global.$SERVICE = undefined;

        after(function () {
            nodgine.$APPLICATION.stopHTTP();
            nodgine.$APPLICATION.stopHTTPS();
        });

        it('should not throw an error loading the file', function () {
            function load() {
                nodgine.loadFromFile(mPath.resolve(__dirname, './loadfromfile/testnodgine.json'));
            }

            expect(load).not.to.throw();
        });

        it('should have globalized all main objects, because the option was on true', function () {
            expect(global.$APPLICATION).to.be.an('object');
            expect(global.$LOGGER).to.be.an('object');
            expect(global.$ROUTER).to.be.an('object');
            expect(global.$SERVICE).to.be.an('object');

            expect(global.$APPLICATION).to.equal(nodgine.$APPLICATION);
            expect(global.$LOGGER).to.equal(nodgine.$LOGGER);
            expect(global.$ROUTER).to.equal(nodgine.$ROUTER);
            expect(global.$SERVICE).to.equal(nodgine.$SERVICE);
        });

        it('should have registered one service', function () {
            var service = $SERVICE.getServiceById('testId'),
                count = $SERVICE.getServicesByType('testType').length;

            expect(count).to.equal(1);
            expect(service).to.be.an('object');
        });

        it('should have set up a reachable http server', function (done) {
            var http = require('http'),
                options = {
                    host: 'localhost',
                    port: 1235,
                    path: '/nodginetestroute',
                    method: 'GET'
                };

            http.get(options, function(res) {
                var data = '';
                res.on('data', function(chunk){data+=chunk;});
                res.on('end', function() {
                    expect(res.statusCode).to.equal(200);
                    expect(data).to.equal('presuccesspost');
                    done();
                });
            });
        });

        it('should have set up a reachable https server', function (done) {
            var http = require('https'),
                options = {
                    host: 'localhost',
                    port: 1236,
                    path: '/nodginetestroute',
                    method: 'GET',
                    rejectUnauthorized: false
                };

            http.get(options, function(res) {
                var data = '';
                res.on('data', function(chunk){data+=chunk;});
                res.on('end', function() {
                    expect(res.statusCode).to.equal(200);
                    expect(data).to.equal('presuccesspost');
                    done();
                });
            });
        });
    });
});
