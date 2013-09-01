# Description
This project is a general architecture build for creating RESTful webservices. It contains all nessecary components for a fast server.

# API

## $LOGGER
This is the logging component. It's a global variable, not rewriteable (may change).

### $LOGGER.error(message)
* message `string` The message that should be logged
Logs the error to the logfile or console and throws it as error to interrupt the programm
### $LOGGER.warning(message)
* message `string` The message that should be logged
Logs the warning to the logfile or console, but don't interrupt the programm
### $LOGGER.log(message)
* message `string` The message that should be logged
Logs the message as "log" to the logfile or console, but don't interrupt the programm
### $LOGGER.setLogFile(logFile)
* logFile `string` The logfile is the absolute path to a file that is the logfile
### $LOGGER.writeToFile(toggle)
* toggle `bool` Sets or unsets the logging to the logfile
### $LOGGER.writeToConsole(toggle)
* toggle `bool` Sets or unsets the logging to the console

## $SERVICE
This component is the "communication center" of all components of your software. You can register your service with a type and a service function. The service register will add an id to the service to make it able to get identified.

## $ROUTER
This is the router of the application, that recieves every connection, analyses url and dispatches request to specified controller. If no controller exists an 404 statuscode is returned.

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

# Developing

## Development environment
For development I use [Eclipse](http://www.eclipse.org/) with the [Nodeeclipse](http://www.nodeclipse.org) plugin. Further more I'm using the [Javascript Development Tools](http://www.eclipse.org/webtools/jsdt/) and for ensuring quality I'm using the [JSHint Eclipse Integration](http://github.eclipsesource.com/jshint-eclipse/).

## Testing
For tests I'm using [nodeunit](https://github.com/caolan/nodeunit). To run all tests run
> nodeunit Tests/
