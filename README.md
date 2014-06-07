# Description #

The nodgine is a small framework for creating fast webservices. The main focuses are speed and easiness.

# Installation #

To install the nodgine with npm use

    npm install nodgine

# Development #

I'm developing this on my own currently, but if you've got an idea, a problem or a solution, let me know by submitting an
[issue](https://github.com/sateffen/nodgine/issues).

Because this is a private project, and I'm not working every day for it. But if there is any bug or question on how to do something,
just open an [issue](https://github.com/sateffen/nodgine/issues). Bugs will get fixed as fast as possible, and questions answered as
fast as possible, too.

## Documentation ##

Currently there are two ways of getting your information. In the repository there is a `/doc` folder, containing an automatically
generated YUIDoc documentation.

Additionally you'll find all further information in the [wiki](https://github.com/sateffen/nodgine/wiki). There are how-tos, concept
explanations and everything you need to know, to work with the nodgine.

If you don't find the information you're looking for, or you don't get how to reach your goal, create a
[ticket](https://github.com/sateffen/nodgine/issues) and ask.

## Testing ##

For the most parts of the application I'm using unittests to automatically find bugs and ensure functionality. To do so
I'm using [nodeunit](https://github.com/caolan/nodeunit).  There is a simple grunt-task to start the tests:

    grunt test

## Example application ##

	// load nodgine
	require('nodgine').globalize();
	// setup route
	$ROUTER.addRoute('/*', function(request, response, arguments){
		response.writeHead(200);
		response.end((new Date).toString());
	});
	
	// start http server
	$APPLICATION.startHTTP(8888);
	// start application
	$APPLICATION.runApplication();

# Contributing #

To contribute to this project you can help in every way you like. Read through the documentation and report mistakes, help make
the documentation better, test the framework or post ideas as a [ticket](https://github.com/sateffen/nodgine/issues).