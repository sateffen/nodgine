/**
 * This is the Service API for the nodgine module
 *
 * @module $SERVICE
 **/

/**
 * The exporting object, which gets revealed
 *
 * @private
 * @type {$SERIVCE}
 * @extends {EventEmitter}
 **/
var EXPORTOBJECT = new (require('events').EventEmitter)(),

    /**
     * A list of all registered services
     *
     * @private
     * @type {Object}
     **/
    mRegisteredServices = {};

/**
 * @event servicesCleared
 */
/**
 * deletes all registered services
 *
 * @method clearServices
 * @static
 * @return {$SERVICE} The instance itself
 */
function mClearServices() {
    'use strict';
    mRegisteredServices = {};
    EXPORTOBJECT.emit('servicesCleared');
    return EXPORTOBJECT;
}

/**
 * Returns all services with the given type in an array
 *
 * @method getServicesByType
 * @static
 * @param {string} aType - Name of the searched type
 * @return {Array} An array containing all matched services as object. The object looks like:
 *      {type: string, controller: function|object, id: number}
 */
function mGetServicesByType(aType) {
    'use strict';
    // preprocess argument
    if (typeof aType !== 'string') {
        throw '$SERVICE.getServicesByType: First param aType needs to be a string, got ' + (typeof aType);
    }
    aType = aType.toLowerCase();
    // allocate some memory
    var returnArray = [];
    // search for every entry with given type
    for (var i in mRegisteredServices) {
        if (mRegisteredServices.hasOwnProperty(i) && mRegisteredServices[i].type === aType) {
            returnArray.push(mRegisteredServices[i]);
        }
    }

    // return the list
    return returnArray;
}

/**
 * Returns the service-controller connected to given id
 *
 * @method getServiceById
 * @static
 * @param {number} aId
 * @return {function|object|undefined}
 */
function mGetServiceById(aId) {
    'use strict';
    if (typeof aId === 'string' && mRegisteredServices[aId]) {
        return mRegisteredServices[aId].controller;
    }
    return undefined;
}

/**
 * @event serviceRegistered
 * @param {string} serviceType the type of the new serice
 * @param {string} serviceId the id of the new serice
 **/
/**
 * Registers given controller as new service from given type, returns the generated id
 *
 * @method registerService
 * @static
 * @param {string} aId
 * @param {string} aType
 * @param {function} aController
 * @return {$SERVICE} The instance itself
 */
function mRegisterService(aId, aType, aController) {
    'use strict';
    // verify input
    if (typeof aId !== 'string') {
        throw '$SERVICE.registerService: First param aId needs to be a string, got ' + (typeof aId);
    }
    if (typeof aType !== 'string') {
        throw '$SERVICE.registerService: Second param aType needs to be a string, got ' + (typeof aType);
    }
    else if (typeof aController !== 'function' && typeof aController !== 'object') {
        throw '$SERVICE.registerService: Third param aController needs to be a function or object, got ' + (typeof aController);
    }
    if (mRegisteredServices[aId]) {
        throw '$SERVICE.registerService: Service with id ' + aId + ' does already exist';
    }

    // register service
    mRegisteredServices[aId] = {
        id: aId,
        type: aType.toLowerCase(),
        controller: aController
    };

    // emit the event
    EXPORTOBJECT.emit('serviceRegistered', aType, aId);
    // return the id for this service
    return EXPORTOBJECT;
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
 * @static
 * @param {number} aId ID of service, that should be unregistered
 * @return {$SERVICE} This instance itself
 */
function mUnregisterService(aId) {
    'use strict';
    if (typeof aId === 'string' && mRegisteredServices[aId]) {
        EXPORTOBJECT.emit('serviceUnregistered', mRegisteredServices[aId].type, aId);
        // set the service to null, so the id can be used by another service, and the memory will get freed
        delete mRegisteredServices[aId];
    }
    return EXPORTOBJECT;
}

// extend EXPORTOBJECT with all properties to reveal
Object.defineProperties(EXPORTOBJECT, {
    'getServicesByType': {
        value: mGetServicesByType,
        enumerable: true
    },
    'getServiceById': {
        value: mGetServiceById,
        enumerable: true
    },
    'registerService': {
        value: mRegisterService,
        enumerable: true
    },
    'unregisterService': {
        value: mUnregisterService,
        enumerable: true
    },
    'clearServices': {
        value: mClearServices,
        enumerable: true
    }
});

module.exports = EXPORTOBJECT;
