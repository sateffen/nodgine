# Nodgine #

This is the main class, that you'll interact with. There are only four important
methods.

For details about servelets, controllerfunctions, missingRouteController, request
and response objects, please refer to the other documents.

If you miss any details, feel free to help me and open an [issue](https://github.com/sateffen/nodgine/issues)

* Nodgine
    * constructor([options])
    * addMiddleware([applingRoute], middleware) -> Nodgine
    * addController(route, controller/servelet) -> Nodgine
    * setMissingRouteController(controller) -> Nodgine
    * getRouter() -> Function

## constructor([options]) ##

The Nodgine is a class, that you have to instanciate. The constructor doesn't require any
special parameters, so you can simply call:

    const Nodgine = require('nodgine');
    const instance = new Nodgine();

Then you can use this instance to add middleware or controller to it, and bind the router
to an http server.

You can instanciate the nodgine with some options as well. This options are all optional,
you don't need them to use the nodgine.

As options parameter you have to pass an object, which can have two params: requestClass
and responseClass. With this you can replace the nodgine internal request and response
classes, so you can add your own logic to them. Here all options:

    const options = {
        requestClass: MyRequestConstructor, // The class constructor for the request
        responseClass: MyResponseConstructor // The class constructor for the response
    };

For details to the classes see faq.md .

## addMiddleware([applingRoute], middleware) -> Nodgine ##

This method adds given middleware to the middleware stack. You can optionally add a route
pattern, the middleware applies for. When using a route pattern, the middleware is only
executed when the route pattern fits.

For more information see the middleware documentation.

This method is chainable.

## addController(route, controller/servelet) -> Nodgine ##

This method registers given controller or servelet at given route as controller.

This method is chainable.

## setMissingRouteController(controller) -> Nodgine ##

Sets the given controller as missing route controller. The missing route controller gets called
when ever no other route controller is registered for called route.

This method is chainable.

## getRouter() -> Function ##

This method returns a function that can be used as router for an http server. You can simply
call

    const Nodgine = require('nodgine');
    const http = require('http');
    const instance = new Nodgine();
    
    instance.add...
    
    http.createServer(instance.getRouter()).listen(80);

The returned function expects to get called with two params, the first is the node request,
the second is the node response.