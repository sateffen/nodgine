# Description #

The nodgine is a small framework for creating fast webservices. The main focuses are speed and easiness.

# Future #

In the past two years I've developed the nodgine as far as it is today, but all this time has left its scars.
Originally I've created the nodgine as my first nodejs project, to learn about dos and don'ts, and since then I've
learned quite a lot.

A lot of my decisions were not that good, so I'll start the nodgine all over. The next version will be 1.0

The next version will focus on:

* Smaller structure: The current version of the nodgine trys to solve all problems at once. This is not good.
The future version of the nodgine will get reduced to a smaller, even more specific version. Things that are cool,
but optional will get outsourced to their own projects.
* Better abstraction: The current nodgine tries to reuse as much as possible from nodejs, so there are no missing
features. This is not a good way, because I can't guarantee for stability, in every situation. I'll try to abstract
the API even better for a future save version.
* Testdriven development: When I started the nodgine, I didn't know about tests, testcoverage or continuous integration.
Because of this the nodgine is not developed with testability in mind, so the currently implemented tests are not as
good as they could be. The next version of the nodgine will get developed in a test driven way.

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
generated JSDoc documentation.

Additionally you'll find all further information in the [wiki](https://github.com/sateffen/nodgine/wiki). There are how-tos, concept
explanations and everything you need to know, to work with the nodgine.

If you don't find the information you're looking for, or you don't get how to reach your goal, create a
[ticket](https://github.com/sateffen/nodgine/issues) and ask.

## Testing ##

For the most parts of the application I'm using unittests to automatically find bugs and ensure functionality. To do so
I'm using [mocha](https://github.com/pghalliday/grunt-mocha-test) and [chai](https://github.com/chaijs/chai). There is a
simple grunt-task to start the tests:

    grunt test

## Example application ##

	// load the nodgine
	require('nodgine').globalize();
	// setup an example route
	$ROUTER.addRoute('/*', function(request, response, arguments){
		response.writeHead(200);
		response.end((new Date).toString());
	});
	
	// start the http server
	$APPLICATION.startHTTP(8888);
	// start application
	$APPLICATION.runApplication();

# Contributing #

To contribute to this project you can help in every way you like. Read through the documentation and report mistakes, help make
the documentation better, test the framework or post ideas as a [ticket](https://github.com/sateffen/nodgine/issues).