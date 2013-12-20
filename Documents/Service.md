
# API

## $SERVICE
This component is the "communication center" of all components of your software. You can register your service with a type and a service function. The service register will add an id to the service to make it able to get identified.

### $SERVICE.clearServices()
This function will delete all services in the list and emit the "servicesCleared" event.

### $SERVICE.getService(type)
* type `string` the type of service that is searched for

This function returns an array containing every controller with given type

### $SERVICE.getServiceById(id)
* id `number` id of the certain service, that should be returned

This function returns the controller with given id. If the controller doesn't exist, `null` is returned
### $SERVICE.registerService(type, controller)
* type `string` type of the service
* controller `function` controller of the service

This function registers a new service with given type and controller and returns the generated service id.
### $SERVICE.unregisterService(id)
* id `number` id of the service, that should be deleted
This function unregisters the service connected to given id
