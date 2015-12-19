'use strict';

const Nodgine = require('./src/nodgine');
const libHttp = require('http');

let instance = new Nodgine();

instance.addMiddleWare((aRequest, aResponse) => {
    aResponse
        .setStatusCode(200)
        .write('PRE');
});

instance.addMiddleWare((aRequest, aResponse) => {
    aResponse
        .write('POST');
});

instance.addController('/', (aRequest, aResponse, aParamsHash) => {
    aResponse
        .write('Controller1')
        .write(JSON.stringify(aParamsHash));
});

instance.addController('/:id', (aRequest, aResponse, aParamsHash) => {
    aResponse
        .write('Controller2')
        .write(JSON.stringify(aParamsHash));
});

libHttp.createServer(instance.getRouter()).listen(8888);
console.log('Lisntening at 8888');