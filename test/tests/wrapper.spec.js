/* global describe,expect,it */
'use strict';

const Wrapper = require('../../src/wrapper');
const chai = require('chai');

describe('Wrapper', () => {
    it('should construct a new object calling it with new', () => {
        let instance = new Wrapper('/', () => { });

        expect(instance instanceof Wrapper).to.equal(true);
        expect(toString.call(instance)).to.equal('[object Object]');
    });

    it('should not call the run function if given route matches not the constructor parameter', () => {
        let callback = chai.spy();
        let instance = new Wrapper('/ok', callback);

        instance.run = chai.spy();
        instance.runWhenRouteMatches('/wrong', {}, {});

        expect(instance.run).to.not.have.been.called();
        expect(callback).to.not.have.been.called();
    });

    it('should call the run function if given route matches the constructor parameter', () => {
        let callback = chai.spy();
        let instance = new Wrapper('/ok', callback);
        let request = {};
        let response = {};

        instance.run = chai.spy();
        instance.runWhenRouteMatches('/ok', request, response);

        expect(instance.run).to.have.been.called.once();
        expect(callback).to.not.have.been.called();

        let callDescription = instance.run.__spy.calls[0];

        expect(typeof callDescription[0]).to.equal('object');
        expect(Array.isArray(callDescription[0])).to.equal(true);
        expect(callDescription[0]).to.have.length(1);
        expect(callDescription[0][0]).to.equal('/ok');
        expect(callDescription[1]).to.equal(request);
        expect(callDescription[2]).to.equal(response);
    });

    it('should run the callback with correct parameters if the run method is invoked', () => {
        let callback = chai.spy();
        let instance = new Wrapper('/ok', callback);
        let request = {};
        let response = {};

        instance.run(['/ok'], request, response);

        expect(callback).to.have.been.called.once();

        let callDescription = callback.__spy.calls[0];

        expect(callDescription[0]).to.equal(request);
        expect(callDescription[1]).to.equal(response);
        expect(typeof callDescription[2]).to.equal('object');
        expect(Object.keys(callDescription[2])).to.have.length(0);
    });
    
    it('should run the callback with correct parameters in the params hash', () => {
        let callback = chai.spy();
        let instance = new Wrapper('/ok/:var1/:other', callback);
        let request = {};
        let response = {};

        instance.run(['/ok', 'test1', '2tset'], request, response);

        expect(callback).to.have.been.called.once();

        let callDescription = callback.__spy.calls[0];

        expect(callDescription[0]).to.equal(request);
        expect(callDescription[1]).to.equal(response);
        expect(typeof callDescription[2]).to.equal('object');
        expect(Object.keys(callDescription[2])).to.have.length(2);
        expect(callDescription[2].var1).to.equal('test1');
        expect(callDescription[2].other).to.equal('2tset');
    });

    it('should return a promise calling the run function', () => {
        let callback = chai.spy();
        let instance = new Wrapper('/ok', callback);
        let request = {};
        let response = {};
        let result = instance.run(['/ok'], request, response);

        expect(result).to.be.an.instanceof(Promise);
    });

    it('should reject the promise if the callback returns false', (done) => {
        let instance = new Wrapper('/ok', () => {
            return false;
        });
        let request = {};
        let response = {};

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
        let instance = new Wrapper('/ok', () => {
            return;
        });
        let request = {};
        let response = {};

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
        let instance = new Wrapper('/ok', () => {
            return Promise.reject();
        });
        let request = {};
        let response = {};

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
        let instance = new Wrapper('/ok', () => {
            return Promise.resolve();
        });
        let request = {};
        let response = {};

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
});