# FAQ #

## What is middleware ##

Middleware is basically the same as in express and restify, so middleware is actually a
"pass through" for each request. Think about it just like a proxy. Every request will
get passed through every middleware, that you've configured, and afterwards passed
to the controller.

Because a middleware gets called for every request, it should be just a small piece of code.
Some examples for middleware are body-parsers, cookie-parsers, authentication filters, and
so on.

## What is a controller ##

A controller is the function, that actually handles the request. This controller will get
the request after the middleware has worked with it. In the controller you should collect
the actual data and render the view for the visitor.

## Can I use middleware of other systems? ##

No, you can't. The reason is, that I think the form of middelware used in systems like
express is not the best approach. I thought a lot about this decision, because now you'll
think about using another library for this job, and it's up to you.

## What is a servelet ##

This is actually something I borrowed from java. I've never done a lot of java, but I **heard**
about servelets, basically classes, that contain a different method for each method a request
could have. Because I like the idea, I've adopted this concept. You can use such a class to
write your controller.

## How to get when something went wrong ##

I'll admit, the Promises are not the most useful thing, because they catch every error and don't
help to debug. But there is at least a little help, you can read about
[here](https://nodejs.org/dist/latest-v4.x/docs/api/process.html#process_event_unhandledrejection)

So basically this:

    process.on('unhandledRejection', (e) => {
        console.log(e.message, e.stack);
        process.exit(1);
    });

Will help you to find rejections, that are not handled. This way you should catch up with problems.

If something goes wrong, the user will get a statuscode 500. This is generated automatically.

## Replace request or response object with own ones ##

You can replace the request and response objects that are passed down to the middleware and controller.

This is pretty simple, but you have to know some facts about this:

* Every request gets ONE request and response instance. All middleware and controller share this
instance for the complete request.
* Every response class have to have a *flush* method. The reason is simple: Flush gets called by the
nodgine to tell the response that it's finished. You have to have a flush method, even if it's empty.
The reason it's named flush is to prevent collisions with streams or so, just something that tells
the idea, but won't collide.
* Request and response constructors get the same parameters. See below.

To replace request or response you have to use the option passed to the nodgine:

    const instance = new Nodgine({
        requestClass: MyRequestClass,
        responseClass: MyResponseClass
    });

You can overwrite both, or just one of them, it's up to you.

As constructor parameter you'll get an object looking like:

    const paramsObject = {
        parsedUrl// the result of nodejs require('url').parse(request.url)
        request // the original nodejs require('http').HttpRequest object
        response // the original nodejs require('http').HttpResponse object 
    };

Both, request and response, will get the same parameters. The reason for this
is simple: The response might interact with the headers of the request object,
or anything else, it's up to you. This way you should be able to do everything
you want.

## Tested node versions ##

To make sure, that the nodgine works with every environment, I use [Codeship](https://codeship.com)
to execute my unit- and integrationtests against the following node versions:

4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10,
5.11, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4 and 7.5

As you might notice, this is every available node version since 4.0, and this
list will grow with each new version in the future.