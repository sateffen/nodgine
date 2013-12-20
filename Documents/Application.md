
#API

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