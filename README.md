# Description
This project is a general architecture build for creating RESTful webservices. It contains all nessecary components for a fast server.

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
