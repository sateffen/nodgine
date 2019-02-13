# FAQ

## What is middleware

Middleware is basically the same as in *express* and *restify*, so it's basically a
"pass through function" for each request. Think about it just like a proxy. Each
request will get passed through each middleware, that you've configured, and afterwards
passed to the controller.

Because a middleware gets called for every request, it should be just a small piece of code.
Some examples for middleware are body-parsers, cookie-parsers, authentication filters, and
so on.

## What is a controller

A controller is the function, that actually handles the request. The controller will get
the request after the middleware finished its work. The controller actually produces the
output for the current request, like a rendered view or the result of a database call.

## Can I use middleware of other systems?

No, you can't.

## What is a servelet

A servelet is something I borrowed from java. I've never done a lot of java, but I **heard**
about servelets, basically classes, that contain a different method for each method a request
could have. Because I like the idea, I've adopted this concept. You can use such a class to
write your controller. For details see *details/servelet.md*.

## How to get when something went wrong

Promises have an annojing problem: They swallow errors. The nodgine will catch each unhandled
rejection in the created promise chain, and finish the request based on the current status. If
the request is not completed yet, the statuscode is set to 500 without an answer.

If the rejection reason is of instance *Error*, it'll rethrow that error, so you can handle it
with [here](https://nodejs.org/dist/latest-v4.x/docs/api/process.html#process_event_unhandledrejection)

So to get the actual error, you have to use code like:

    process.on('unhandledRejection', (e) => {
        console.log(e.message, e.stack);
        process.exit(1);
    });

## Replace request or response object with own ones

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

You can override both, or just one of them, it's up to you.

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
