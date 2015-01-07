'use strict';

var chai = require('chai'),
    expect = chai.expect,
    mPath = require('path'),
    mApplication = require('../../src/bootstrap.js').$APPLICATION;

describe('$APPLICATION should work as intended', function () {
    it('should emit the run event on runApplication', function (done) {
        mApplication.once('startApplication', function () {
            expect(true).to.equal(true);
            done();
        });

        function runApplication() {
            mApplication.runApplication();
        }

        expect(runApplication).not.to.throw();
    });

    it('should emit the stop event on stopApplication', function (done) {
        mApplication.once('stopApplication', function () {
            expect(true).to.equal(true);
            done();
        });

        function stopApplication() {
            mApplication.stopApplication();
        }

        expect(stopApplication).not.to.throw();
    });
});
