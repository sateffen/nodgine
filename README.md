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


# Developing

## Development environment
For development I use [Eclipse](http://www.eclipse.org/) with the [Nodeeclipse](http://www.nodeclipse.org) plugin. Further more I'm using the [Javascript Development Tools](http://www.eclipse.org/webtools/jsdt/) and for ensuring quality I'm using the [JSHint Eclipse Integration](http://github.eclipsesource.com/jshint-eclipse/).

## Testing
For tests I'm using [nodeunit](https://github.com/caolan/nodeunit). To run all tests run
> nodeunit Tests/
