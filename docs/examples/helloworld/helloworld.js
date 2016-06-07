// this example simply returns hello world to EVERY request
'use strict';

// first you have to load the nodgine. Usually you'll call require('nodgine'),
// but here I'll refer to the module itself, so the example works
const Nodgine = require('../../../');
// and load the http lib from node. If you want to use https, just load https
const libHttp = require('http');

// then create an instance of the nodgine. I don't have any good idea for a name,
// so I'll name it instance
const instance = new Nodgine();
// then I create a server, where I'll pass the router of the instance. You can receive
// it by calling instance.getRouter(). This will return a routing function for the
// http server.
const server = libHttp.createServer(instance.getRouter());

// then we add a controller to the instance
instance.addController('/*', (request, response) => {
    // that simply writes the statuscode and a text to the response
    response
        .setStatusCode(200)
        .write('Hello World');
    // you do not need to flush the response, flushing is done automatically
    // we don't return a promise, so this controller is handled as synchron request
});

// finally call listen
server.listen(8888);