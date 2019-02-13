/* global describe,expect,it */
'use strict';

const Wrapper = require('../../src/wrapper');
const libChai = require('chai');

describe('Wrapper', () => {
    it('should construct a new object calling it with new', () => {
        const instance = new Wrapper('/', () => {
            // silence
        });

        expect(instance instanceof Wrapper).to.equal(true);
        expect(toString.call(instance)).to.equal('[object Object]');
    });

    it('should not call the run function if given route matches not the constructor parameter', () => {
        const callback = libChai.spy();
        const instance = new Wrapper('/ok', callback);

        instance.run = libChai.spy();
        instance.runWhenRouteMatches('/wrong', {}, {});

        expect(instance.run).to.not.have.been.called();
        expect(callback).to.not.have.been.called();
    });

    it('should call the run function if given route matches the constructor parameter', () => {
        const callback = libChai.spy();
        const instance = new Wrapper('/ok', callback);
        const request = {};
        const response = {};

        instance.run = libChai.spy();
        instance.runWhenRouteMatches('/ok', request, response);

        expect(instance.run).to.have.been.called.once();
        expect(callback).to.not.have.been.called();

        const callDescription = instance.run.__spy.calls[0];

        expect(typeof callDescription[0]).to.equal('object');
        expect(Array.isArray(callDescription[0])).to.equal(true);
        expect(callDescription[0]).to.have.length(1);
        expect(callDescription[0][0]).to.equal('/ok');
        expect(callDescription[1]).to.equal(request);
        expect(callDescription[2]).to.equal(response);
    });

    it('should run the callback with correct parameters if the run method is invoked', () => {
        const callback = libChai.spy();
        const instance = new Wrapper('/ok', callback);
        const request = {};
        const response = {};

        instance.run(['/ok'], request, response);

        expect(callback).to.have.been.called.once();

        const callDescription = callback.__spy.calls[0];

        expect(callDescription[0]).to.equal(request);
        expect(callDescription[1]).to.equal(response);
        expect(typeof callDescription[2]).to.equal('object');
        expect(Object.keys(callDescription[2])).to.have.length(0);
    });

    it('should run the callback with correct parameters in the params hash', () => {
        const callback = libChai.spy();
        const instance = new Wrapper('/ok/:var1/:other', callback);
        const request = {};
        const response = {};

        instance.run(['/ok', 'test1', '2tset'], request, response);

        expect(callback).to.have.been.called.once();

        const callDescription = callback.__spy.calls[0];

        expect(callDescription[0]).to.equal(request);
        expect(callDescription[1]).to.equal(response);
        expect(typeof callDescription[2]).to.equal('object');
        expect(Object.keys(callDescription[2])).to.have.length(2);
        expect(callDescription[2].var1).to.equal('test1');
        expect(callDescription[2].other).to.equal('2tset');
    });

    it('should return a promise calling the run function', () => {
        const callback = libChai.spy();
        const instance = new Wrapper('/ok', callback);
        const request = {};
        const response = {};
        const result = instance.run(['/ok'], request, response);

        expect(result).to.be.an.instanceof(Promise);
    });

    it('should reject the promise if the callback returns false', (done) => {
        const instance = new Wrapper('/ok', () => {
            return false;
        });
        const request = {};
        const response = {};

        instance.run(['/ok'], request, response)
            .then(() => {
                expect(false).to.equal(true);
                done();
            })
            .catch(() => {
                expect(true).to.equal(true);
                done();
            });
    });

    it('should resolve if the callback returns nothing', (done) => {
        const instance = new Wrapper('/ok', () => {
            return;
        });
        const request = {};
        const response = {};

        instance.run(['/ok'], request, response)
            .then(() => {
                expect(true).to.equal(true);
                done();
            })
            .catch(() => {
                expect(false).to.equal(true);
                done();
            });
    });

    it('should reject if the callback returns a rejected promise', (done) => {
        const instance = new Wrapper('/ok', () => {
            return Promise.reject();
        });
        const request = {};
        const response = {};

        instance.run(['/ok'], request, response)
            .then(() => {
                expect(false).to.equal(true);
                done();
            })
            .catch(() => {
                expect(true).to.equal(true);
                done();
            });
    });

    it('should resolve if the callback returns a resolved promise', (done) => {
        const instance = new Wrapper('/ok', () => {
            return Promise.resolve();
        });
        const request = {};
        const response = {};

        instance.run(['/ok'], request, response)
            .then(() => {
                expect(true).to.equal(true);
                done();
            })
            .catch(() => {
                expect(false).to.equal(true);
                done();
            });
    });

    it('should return the _routePattern calling getPattern()', () => {
        const route = '/' + Math.random().toString(26).slice(2);
        const instance = new Wrapper(route, () => {
            // silence
        });

        expect(instance.getPattern()).to.equal(instance._routePattern);
    });
});
