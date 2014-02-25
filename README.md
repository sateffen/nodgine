# Description
This project is a general architecture build for creating RESTful webservices. It contains all nessecary components for
a fast webserver.

## Warning
This project is under heavy development. As long as version 0.1 isn't released, I'll work at master branch. The API might
change, so don't rely on it, but I try to have it consistent.

If you think there is a bug or you've got some ideas for making this project better, just open a issue-report.

## The Name
Nodgine is a fusion of the words NodeJS and engine: Nod(eJS)(en)gine.

# Example Application
As example we will setup a http server, that listens at port 8888 and answers to every request with the current time.

	// load architecture
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

Now you can start this with your node, and call the adress localhost:8888 from your webbrowser. You can add every path
to it, every path will present the same result in this example.

# Developing

## Documentation
In this project the documentation is created automaticaly. To do so I'm using YUIDoc.

## Testing
For tests I'm using [nodeunit](https://github.com/caolan/nodeunit). To run all tests run
> nodeunit Tests/
