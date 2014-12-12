/**
 * This is the Service API for the nodgine module
 *
 * @module $SERVICE
 **/
'use strict';
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
    mRegisteredServices = {};
    EXPORTOBJECT.emit('servicesCleared');
    return EXPORTOBJECT;
}

/**
 * Returns all services with the given type in an array
 *
 * @method getServicesByType
 * @static
 * @param {string} aType - Name of the searched type (case-sensitive!)
 * @return {array} An array containing all matched services.
 */
function mGetServicesByType(aType) {
    // preprocess argument
    if (typeof aType !== 'string') {
        throw '$SERVICE.getServicesByType: First param aType needs to be a string, got ' + (typeof aType);
    }

    // allocate some memory
    var returnArray = [];
    // search for every entry with given type
    for (var i in mRegisteredServices) {
        if (mRegisteredServices.hasOwnProperty(i) && mRegisteredServices[i].type === aType) {
            returnArray.push(mRegisteredServices[i].controller);
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
 * @param {string} aId The id of the service to retrieve (case-sensitive!)
 * @return {function|object|undefined}
 */
function mGetServiceById(aId) {
    // preprocess argument
    if (typeof aId !== 'string') {
        throw '$SERVICE.getServiceById: First param aType needs to be a string, got ' + (typeof aType);
    }

    if (mRegisteredServices[aId]) {
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
 * @param {function|object} aController
 * @return {$SERVICE} The instance itself
 */
function mRegisterService(aId, aType, aController) {
    // verify input
    if (typeof aId !== 'string') {
        throw '$SERVICE.registerService: First param aId needs to be a string, got ' + (typeof aId);
    }
    if (typeof aType !== 'string') {
        throw '$SERVICE.registerService: Second param aType needs to be a string, got ' + (typeof aType);
    }
    else if ((typeof aController !== 'function' && typeof aController !== 'object') || aController === null || Array.isArray(aController)) {
        throw '$SERVICE.registerService: Third param aController needs to be a function or object,' +
              'and not an array of null, got ' + (typeof aController);
    }
    if (mRegisteredServices[aId]) {
        throw '$SERVICE.registerService: Service with id ' + aId + ' does already exist';
    }

    // register service
    mRegisteredServices[aId] = {
        id: aId,
        type: aType,
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
