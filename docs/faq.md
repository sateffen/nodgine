# FAQ #

## What is middleware ##

Middleware is basicly the same as in express and restify, so middleware is actually a
"pass through" for each request. Think about it just like a proxy. Every request will
get passed through every middleware, that you've configured, and and afterwards passed
to the controller.

Because a middleware gets called by every request it should be just a small piece of logic.
Some examples for middleware are body-parsers, cookie-parsers, authentication filters, and
so on.

## What is a controller ##

A controller is the function, that actually handles the request. This controller will get
the request after the middleware has worked with it. In the controller you should collect
the actual data and render the view for the visitor.

## Can I use middleware of other systems? ##

No, you can't. The reason is, that I think the form of middelware used in systems like
express is not the best approach. I thought a lot about this decission, because now you'll
think about using another library for this job, and it's up to you, but I think middleware
should get its own route params for the single route, that it got matched for.

## What is a servelet ##

This is actually something I borrowed from java. I've never done a lot of java, but I **heard**
about servelets, basicly classes, that contain a different method for each method a request
could have. Because I like the idea, I've adopted this concept. As controller you can use such
a class to write your controller.

## How to get when something went wrong ##

I'll admit, the Promises are not the most useful thing, because they catch every error and don't
help debugging. But there is at least a little help, you can read about
[HERE](https://nodejs.org/dist/latest-v4.x/docs/api/process.html#process_event_unhandledrejection)

So basicly this:

	process.on('unhandledRejection', (e) => {
		console.log(e.message, e.stack);
		process.exit(1);
	});

Will help you finding rejections, that are not handled. This way you should catch up with problems.

If something goes wrong the user will get a statuscode 500. This is generated automatically.