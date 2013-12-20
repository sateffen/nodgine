
# API

## $ROUTER
This is the router of the application, that recieves every connection, analyses url and dispatches request to specified controller. If no controller exists an 404 statuscode is returned.

### $ROUTER.route(request, response)
* request `request Object` request object of an http request
* response `response Object` response object of an http request

Routes given request and response pair to a requested path and controller

### $ROUTER.addRoute(path, callback, caseSensetive)
* path `string` the specific path for the router
* callback `function` or `object` if the callback is a function, it is called, when the given path fits. If it is an object the request method will be evaluated and routed to the functions of the object. The object should implement at least one if this functions: doGet, doPost, doPut, doDelete, doHead
* caseSensetive `bool` defines, whether the path is case sensetive or not

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