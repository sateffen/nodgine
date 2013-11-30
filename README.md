# Description
This project is a general architecture build for creating RESTful webservices. It contains all nessecary components for a fast server.

# API

## $LOGGER
This is a logging component. It's a global variable, not rewriteable (may change).

### $LOGGER.error(message)
* message `string` The message that should be logged

Logs the error to the logfile or console and throws it as error to interrupt the program

### $LOGGER.warning(message)
* message `string` The message that should be logged

Logs the warning to the logfile or console, but don't interrupt the program

### $LOGGER.log(message)
* message `string` The message that should be logged

Logs the message as "log" to the logfile or console, but don't interrupt the program

### $LOGGER.setLogFile(logFile)
* logFile `string` The logfile is the absolute path to a file that is the logfile

### $LOGGER.writeToFile(toggle)
* toggle `bool` Sets or unsets the logging to the logfile

### $LOGGER.writeToConsole(toggle)
* toggle `bool` Sets or unsets the logging to the console

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

## $ROUTER
This is the router of the application, that recieves every connection, analyses url and dispatches request to specified controller. If no controller exists an 404 statuscode is returned.

### $ROUTER.route(request, response)
* request `request Object` request object of an http request
* response `response Object` response object of an http request

Routes given request and response pair to a requested path and controller

### $ROUTER.addRoute(path, callback, caseSensetive)
* path `string` the specific path for the router
* callback `function` or `object` if the callback is a function, it is called, when the given path fits. If it is an object the request method will be evaluated and routed to the functions of the object. The object should implement at least one if this functions: doGet, doPost, doPut, doDelete, doHead
* caseSensetive `bool` defines, whether the path is case sensetive or not

### $ROUTER.getRoute(path)
* path `string` the path that should be found

Returns the callback that is connected to given path, or undefined

### $ROUTER.setDefaultRoute(controller)
* controller `function` the controller, that is called, when no route is found

Sets a specific controller, that will be called, if no route matches

### $ROUTER.getDefaultRoute()
Returns the default controller

### $ROUTER.setEncoding(encoding)
* encoding `string` The encoding that should be used (default: utf-8)

### $ROUTER.getEncoding()
Returns the current used encoding

### $ROUTER.clearRoutes()
Removes all routes.

## $APPLICATION
This is the application object. Here are events emitted, which affect the whole application, like "startApplication" and "stopApplication". This object holds the current http and https server, if started. Only one of a kind are allowed at the same time.

### $APPLICATION.startHTTP(port)
* port `number` Defines the port the httpserver should listen at

Starts the http server at given port

### $APPLICATION.startHTTPS(key, cert, port)
* key `string` Defines the absolute path to the key file for https connection
* cert `string` Defines the absolute path to the certificate file for https connection
* port `number` Defines the port the httpsserver should listen at

Starts the https server with given key and certificate at given port

### $APPLICATION.stopHTTP()
Stops the http server

### $APPLICATION.stopHTTPS()
Stops the https server

### $APPLICATION.run()
Tells the application to emit the "startApplication" event, so every listener knows the application has started

### $APPLICATION.stop()
Tells the application to emit the "stopApplication" event, so every listener knows the application has stopped

### $APPLICATION.addLoadPath(path)
* path `string` Defines the path which should be searched recursively

Adds a load path, from that javascript objects can be loaded

### $APPLICATION.create(objectName, param)
* objectName `string` Defines the object name, that should be instanciated
* param `object` The parameter that is passed through

Creates an instance of the given object name. That object name is from the PSR0

### $APPLICATION.load(objectName)
* objectName `string` Defines the object name, that should be loaded

Returns the prototype of given object name. That object name is from the PSR0

# Example Application
As example we will setup a http server, that listens at port 8888 and answers to every request with the current time.
```js
// load architecture
require("NodeWebserverArchitecture");
// setup route
$ROUTE.addRoute("/*", function(request, response, arguments){
	response.writeHead(200);
	response.end((new Date).toString());
});

// start http server
$APPLICATION.startHTTP(8888);
// start application
$APPLICATION.run();
```

Now you can start this with your node, and call the adress localhost:8888 from your webbrowser. You can add every path to it, every path will present the same result in this example.

# Developing

## Development environment
For development I use [Eclipse](http://www.eclipse.org/) with the [Nodeeclipse](http://www.nodeclipse.org) plugin. Further more I'm using the [Javascript Development Tools](http://www.eclipse.org/webtools/jsdt/) and for ensuring quality I'm using the [JSHint Eclipse Integration](http://github.eclipsesource.com/jshint-eclipse/).

## Testing
For tests I'm using [nodeunit](https://github.com/caolan/nodeunit). To run all tests run
> nodeunit Tests/
