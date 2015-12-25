/* global describe,expect,it */
'use strict';

const utils = require('../../src/utils');
const chai = require('chai');

function mockFactory(aMethod, aNoCallback) {
    let mock = {
        servelet: aNoCallback ? {} : {
            doGet: chai.spy(),
            doPost: chai.spy(),
            doPut: chai.spy(),
            doDelete: chai.spy()
        },
        request: {
            getMethod: chai.spy(() => {
                return aMethod.toLowerCase();
            })
        },
        response: {
            write: chai.spy(() => {
                return mock.response;
            }),
            setStatusCode: chai.spy(() => {
                return mock.response;
            })
        },
        params: {}
    };

    return mock;
}

describe('Utils', () => {
    it('should return true calling isObject with an object', () => {
        expect(utils.isObject({})).to.equal(true);
        expect(utils.isObject(Object.create(null))).to.equal(true);
    });

    [0, 1, 3.14, -2.7, 'Test', true, false, [], () => { }, undefined, null].forEach((aValue) => {
        it('should return false calling isObject with ' + toString.call(aValue), () => {
            expect(utils.isObject(aValue)).to.equal(false);
        });
    });

    it('should return a function calling wrapServeletToFunction', () => {
        let result = utils.wrapServeletToFunction({});

        expect(typeof result).to.equal('function');
    });

    it('should return a function expecting three parameters calling wrapServeletToFunction', () => {
        let result = utils.wrapServeletToFunction({});

        expect(result).to.have.length(3);
    });

    it('should request the method from the request object in wrapper function for servelet', () => {
        let mock = mockFactory('get', true);
        let result = utils.wrapServeletToFunction(mock.servelet);

        result(mock.request, mock.response, mock.params);

        expect(mock.request.getMethod).to.have.been.called();
    });

    it('should end respond with 404 when no matching handler is there in wrapper function for servelet', () => {
        let mock = mockFactory('get', true);
        let result = utils.wrapServeletToFunction(mock.servelet);

        result(mock.request, mock.response, mock.params);

        expect(mock.response.setStatusCode).to.have.been.called();
        expect(mock.response.write).to.have.been.called();
        expect(mock.response.setStatusCode).to.have.been.called.with(404);
        expect(mock.response.write).to.have.been.called.with('Not Found');
    });
    
    ['Get', 'Post', 'Put', 'Delete'].forEach((aMethod) => {
        it('should call the correct servelet method for calling method ' + aMethod, () => {
            let mock = mockFactory(aMethod);
            let result = utils.wrapServeletToFunction(mock.servelet);
            
            result(mock.request, mock.response, mock.params);
        
            expect(mock.servelet['do' + aMethod]).to.have.been.called();
            expect(mock.servelet['do' + aMethod]).to.have.been.called.with(mock.request, mock.response, mock.params);
        });
    });
});