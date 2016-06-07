// in this example we will write a server, that does the same as a todo mvc,
// but everything works via this server
'use strict';

// so we start of like in the helloworld example. If you didn't check it
// and you've got a question about this, please refer to helloworld.js
const Nodgine = require('../../../');
const libHttp = require('http');
const libFs = require('fs');

const instance = new Nodgine();
const server = libHttp.createServer(instance.getRouter());
const toDoHash = {};

// now we have the same setup like in the helloworld.js example. Now we have to
// add the actual code

// first we add a middleware, that sets the content header to json, so we don't
// have to do it every time again. This applies only to api requests
instance.addMiddleware('/api/*', (request, response) => {
    response.setHeader('content-type', 'application/json');
});

// Here we add a servelet, that handles the requests for get post and delete.
// This is capable of more than the simple html client can, but it's all just
// an example
instance.addController('/api/todo/:id?', {
    doGet: (request, response, params) => {
        if (params.id === undefined) {
            response
                .setStatusCode(200)
                .write(JSON.stringify(toDoHash));
        }
        else if (toDoHash[params.id]) {
            response
                .setStatusCode(200)
                .write(JSON.stringify(toDoHash[params.id]));
        }
        else {
            response.setStatusCode(404);
        }
    },
    doPost: (request, response, params) => {
        if (params.id === undefined) {
            response.setStatusCode(404);
        }
        else {
            toDoHash[params.id] = request.getBody().toString();
            response
                .setStatusCode(200)
                .write(JSON.stringify(toDoHash[params.id]));
        }
    },
    doDelete: (request, response, params) => {
        if (params.id !== undefined) {
            toDoHash[params.id] = undefined;
        }

        response.setStatusCode(200);
    }
});

// and we add another controller, that simply returns the html file. The file is not
// cached, it is read every time, so there might be a short lock, but this is just an
// example for an async controller. Imagine a database here.
instance.addController('/', (request, response) => {
    const fileStream = libFs.createReadStream(__dirname + '/todoserver.html');

    response
        .setStatusCode(200)
        .setHeader('content-type', 'text/html')
        .pipe(fileStream);
});

// then start the actual server
server.listen(8888);