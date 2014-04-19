# Description #
This project is a general architecture build for creating RESTful webservices. It contains all nessecary components for
a fast webserver.

## The Name ##
Nodgine is a fusion of the words NodeJS and engine: Nod(eJS)(en)gine.

# Example Application #
the server.js file:

	// load nodgine
	require('Nodgine').globalize();
	// setup route
	$ROUTER.addRoute('/*', function(request, response, arguments){
		response.writeHead(200);
		response.end((new Date).toString());
	});
	
	// start http server
	$APPLICATION.startHTTP(8888);
	// start application
	$APPLICATION.runApplication();

Now you can start this with nodejs, and navigate your browser to http://localhost:8888. In this example every URI will
get answered with the current time.

# Developing #

## Documentation #
In this project the documentation is created automaticaly. To do so I'm using YUIDoc.

## Testing ##
For tests I'm using [nodeunit](https://github.com/caolan/nodeunit). To run all tests use
> nodeunit Tests/

Otherwise you can use grunt. You can simply use the default task, to build the project, or use
> grunt test

to run the tests only.

## Building ##
To build this project you'll need grunt. If it's installed, you can simply run the default grunt task of this project.
Then the project is build to the "dist" directory.