# Description
This project is a general architecture build for creating RESTful webservices. It contains all nessecary components for a fast webserver.

## The Name
Nodgine is a fusion of the words NodeJS and engine: Nod(eJS)(en)gine.

# Example Application
As example we will setup a http server, that listens at port 8888 and answers to every request with the current time.

	// load architecture
	require("Nodgine");
	// setup route
	$ROUTE.addRoute("/*", function(request, response, arguments){
		response.writeHead(200);
		response.end((new Date).toString());
	});
	
	// start http server
	$APPLICATION.startHTTP(8888);
	// start application
	$APPLICATION.run();

Now you can start this with your node, and call the adress localhost:8888 from your webbrowser. You can add every path to it, every path will present the same result in this example.

# Developing

## Testing
For tests I'm using [nodeunit](https://github.com/caolan/nodeunit). To run all tests run
> nodeunit Tests/
