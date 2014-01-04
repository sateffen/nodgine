
# API

## $ROUTER
This is the router of the application, that recieves every connection, analyses url and dispatches request to specified controller. If no controller exists an 404 statuscode is returned.

### $ROUTER.route(request, response)
* request `request Object` request object of an http request
* response `response Object` response object of an http request

Routes given request and response pair to a requested path and controller. This function will be connected automatically to $APPLICATION.startHTTP and $APPLICATION.startHTTPS, so most of the times you won't need to call this function.

### $ROUTER.addRoute(path, callback, caseSensetive)
* path `string` the specific path for the router
* callback `function` or `object` if the callback is a function, it is called, when the given path fits. If it is an object the request method will be evaluated and routed to the functions of the object. The object should implement at least one if this functions: doGet, doPost, doPut, doDelete, doHead
* caseSensetive `bool` defines, whether the path is case sensetive or not

This function will add a new route to the router. This is maybe the most important part in this engine. There are two important parameters: path and callback.

The path variable describes a path with its pattern. The code is originaly from ExpressJS and changed by me, so every pattern from that ExpressJS should work. There are some special things about this:

* the path should start with an slash
* you can define just normal paths like `/css/style.css` (important: /css will ONLY match /css, and nothing like `/css/test.css`, to archive this read on :-P)
* there is a wildcart option: `/css/*` will route /css exactly like /css/hello/world.css, but the path woun't be extracted to arguments
* you can specify certain arguments, for that should be watched with an : like `/css/:filename` . With this pattern your callback would get the request /css/test.css and recieve the argument `{filename: 'test.css'}`, but /css/subfolder/test.css wouldn't get routed, cause it has more than one parameter.
* There are optional parameters, too! For an optional parameter simply add an ? at the end of the variable: `/css/:arg1/:arg2?`, now arg1 has to be set, but arg2 doesn't. So eighter /css/test.css will get routed with `{arg1: 'test.css', arg2: undefined}` or /css/subfolder/test.css will get routed with `{arg1: 'subfolder', arg2: 'test.css'}`. (Hint: for css you should use `/css/*` to catch every request, or `/css/:arg1/:arg2?/:arg3?/*` to filter for arguments)

The second parameter is the callback. Typicaly this will be a funtion, but objects are just fine, too, but they have to have a certain structure.

Starting with the function, this has a pretty simple setup: `function(request, response, arguments) {}`, thats all. The request and response will be the request and response objects are just the normal NodeJS http objects (except the request, this has some useful stuff added, see later). The arguments parameter contains an object, holding every argument specified in the path.

The second possibility is an object, that remembers of java servlets. The object has to have some of the functions doGet, doPost, doPut, doDelete, doHead. Every function acts like a normal callback function, but is connected to certain http-method. The object doesn't need to have very method, but should have at least one, otherwise the routing to a function will fail and call the default controller.

#### The request object
The request object passed to a callback function is just a normal NodeJS http request object, containing three additional options: get, post and cookie. All this options are objects, containing the recieved values.

### $ROUTER.getRoute(path)
* path `string` the path that should be found

Returns the callback that is connected to given path, or undefined

### $ROUTER.setDefaultRoute(controller)
* controller `function` the controller, that is called, when no route is found

Sets a specific controller, that will be called, if no route matches

### $ROUTER.getDefaultRoute()
Returns the default controller

### $ROUTER.setEncoding(encoding)
* encoding `string` The encoding that should be used (default: utf-8)

### $ROUTER.getEncoding()
Returns the current used encoding

### $ROUTER.clearRoutes()
Removes all routes.