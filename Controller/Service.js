/**
 * This is the Service API for the nodgine module
 *
 * @module nodgine
 * @submodule $SERVICE
 * @class $SERVICE
 * @static
 **/

/**
 * The exporting object, which gets revealed
 *
 * @type {object}
 **/
var EXPORTOBJECT = new (require('events').EventEmitter)(),

    /**
     * A list of all registered services
     *
     * @private
     * @type {Array}
     **/
    mRegisteredServices = [];

/**
 * @event servicesCleared
 **/
/**
 * deletes all registered services
 *
 * @chainable
 * @method clearServices
 * @return {object} The instance itself
 */
function mClearServices() {
    'use strict';
    mRegisteredServices = [];
    EXPORTOBJECT.emit('servicesCleared');
    return EXPORTOBJECT;
}

/**
 * Returns all services with the given type in an array
 *
 * @method getService
 * @param {string} aType Name of the searched type
 * @return {Array} An array containing all matched services as object. The object looks like:
 *      {type: string, controller: function|object, id: number}
 */
function mGetService(aType) {
    'use strict';
    if (typeof aType !== 'string') {
        throw '$SERVICE.getService: First param aType needs to be a string, got ' + (typeof aType);
    }
    aType = aType.toLowerCase();
    var returnArray = [];
    for (var i in mRegisteredServices) {
        if (mRegisteredServices[i] && mRegisteredServices[i].type === aType) {
            returnArray.push(mRegisteredServices[i]);
        }
    }
    
    return returnArray;
}

/**
 * Returns the service connected to given id
 *
 * @method getServiceById
 * @param {number} aId
 * @returns {function | null}
 */
function mGetServiceById(aId) {
    'use strict';
    if (typeof aId === 'number' && mRegisteredServices && mRegisteredServices[aId]) {
        return mRegisteredServices[aId];
    }
    return null;
}

/**
 * @event serviceRegistered
 * @param {string} serviceType the type of the new serice
 * @param {number} serviceId the id of the new serice
 **/
/**
 * Registers given controller as new service from given type, returns the generated id
 *
 * @method registerService
 * @param {string} aType
 * @param {function} aController
 * @return {number}
 */
function mRegisterService(aType, aController) {
    'use strict';
    // verify input
    if (typeof aType !== 'string') {
        throw '$SERVICE.registerService: First param aType needs to be a string, got ' + (typeof aType);
    }
    else if (typeof aController !== 'function' && typeof aController !== 'object') {
        throw '$SERVICE.registerService: Second param aController needs to be a function or object, got ' + (typeof aController);
    }

    var id = mRegisteredServices.push(null)-1;
    mRegisteredServices[id] = {
        id: id,
        type: aType.toLowerCase(),
        controller: aController
    };
    
    EXPORTOBJECT.emit('serviceRegistered', aType, id);
    return id;
}

/**
 * @event serviceUnregistered
 * @param {string} serviceType the type of the new serice
 * @param {number} serviceId the id of the new serice
 **/
/**
 * Unregisters the service with given id
 *
 * @method unregisterService
 * @param {number} aId ID of service, that should be unregistered
 * @return {object} This instance itself
 */
function mUnregisterService(aId) {
    'use strict';
    if (typeof aId === 'number' && mRegisteredServices && mRegisteredServices[aId]) {
        EXPORTOBJECT.emit('serviceUnregistered', mRegisteredServices[aId].type, aId);
        mRegisteredServices[aId] = null;
    }
    return EXPORTOBJECT;
}

// extend EXPORTOBJECT with all properties to reveal
Object.defineProperties(EXPORTOBJECT, {
    'getService': {
        value: mGetService
    },
    'getServiceById': {
        value: mGetServiceById
    },
    'registerService': {
        value: mRegisterService
    },
    'unregisterService': {
        value: mUnregisterService
    },
    'clearServices': {
        value: mClearServices
    }
});

module.exports = EXPORTOBJECT;