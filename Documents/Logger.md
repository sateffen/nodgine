
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