# Controller

A controller is the real handler function, that should work as the main endpoint
controller. Each controller gets connected to a route pattern. If a request with
a matching route comes in, the corresponding controller gets called.

## The execution flow

So, this is the end of the execution flow. The main flow looks like this:

    Request incomming ==> Middleware chain ==> Controller ==> Response flush

So the controller gets executed after the middleware chain, if the request was
not stopped by any middleware before.

Because the response flush happens automatically, the controller has to tell the
flow when to flush.

## Async controller

The basic version of a controller, that doesn't return anything, is synchronous,
so the response gets flushed directly afterwards.

If your work has to be executed async, there is a simple solution: Just return a
promise. By returning a promise you can tell the flow, when to take the next step.

So your controller looks like this:

    function (request, response) {
        return new Promise((resolve, reject) => {
            global.setTimeout(resolve, 1000);
        });    
    }

## Using route params

A lot of requests will have a dynamic part. You have to tell the dynamic part in the
route matcher, so the system will extract the information and give it to you. Because
I use the same matching algorithm as express, you can use the exact same route patterns
like in express. So you can use the test page [HERE](https://forbeslindesay.github.io/express-route-tester/).

If you've got some named params, for example in a route like `/api/user/:id`, you can
access the named variables in the third parameter of a controller.

So, you can use this signature for a controller:

    nodgineInstance.addController('/api/user/:id', function (request, response, routeParams) {
        // work with routeParams.id
    });

You can use optional parameters as well:

    nodgineInstance.addController('/api/user/:id/:action?', function (request, response, routeParams) {
        // work with routeParams.id and routeParams.action
    });

But routeParams.action might be undefined.
