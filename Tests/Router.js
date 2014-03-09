/**
 * Unittest for the router
 */

var nodgineRouter = require('../Bootstrap.js').$ROUTER,
    httpServer = require('http').createServer(nodgineRouter.route);

exports.getEncoding = function(test) {
    'use strict';
    test.equal(nodgineRouter.getEncoding(), 'utf8');
    test.done();
};

exports.setEncoding = function(test) {
    'use strict';

    nodgineRouter.setEncoding('ascii');
    test.equal(nodgineRouter.getEncoding(), 'ascii');
    nodgineRouter.setEncoding('undefined', false);
    test.equal(nodgineRouter.getEncoding(), 'undefined');
    nodgineRouter.setEncoding('utf8');
    test.equal(nodgineRouter.getEncoding(), 'utf8');

    try {
        nodgineRouter.setEncoding('undefined');
        test.ok(false, 'setEncoding(\'undefined\') should throw an error.');
    }
    catch (e) {
        test.ok(true, e);
    }

    test.done();
};

exports.getDefaultRoute = function(test) {
    'use strict';
    test.equal(nodgineRouter.getDefaultRoute(), null);
    test.done();
};

exports.setDefaultRoute = function(test) {
    'use strict';
    var tFunc1 = function(){return 0;},
        tFunc2 = function(){return 1;};
    nodgineRouter.setDefaultRoute(tFunc1);
    test.equal(nodgineRouter.getDefaultRoute(), tFunc1);
    nodgineRouter.setDefaultRoute(tFunc2);
    test.equal(nodgineRouter.getDefaultRoute(), tFunc2);
    test.done();
};

exports.getRoute = function(test) {
    'use strict';
    var tFunc = function(){};
    nodgineRouter.addRoute('/testGetRoute', tFunc);
    test.equal(nodgineRouter.getRoute('/tttt'), undefined);
    test.equal(nodgineRouter.getRoute('/testGetRoute').callback, tFunc);
    test.done();
    nodgineRouter.clearRoutes();
};

exports.addRoute = function(test) {
    'use strict';
    nodgineRouter.addRoute('/testAddRoute', function(){});
    nodgineRouter.addRoute('/testAddRoute2', function(){});
    test.ok(nodgineRouter.getRoute('/testAddRoute'));
    test.ok(nodgineRouter.getRoute('/testAddRoute2'));
    test.done();
    nodgineRouter.clearRoutes();
};

exports.clearRoutes = function(test) {
    'use strict';
    nodgineRouter.addRoute('/testclearRoutes', function(){});
    nodgineRouter.addRoute('/testclearRoutes2', function(){});
    nodgineRouter.clearRoutes();
    test.ok(!nodgineRouter.getRoute('/testclearRoutes'));
    test.ok(!nodgineRouter.getRoute('/testclearRoutes2'));
    test.done();
};

exports.route = function(test) {
    'use strict';
    var tFunc1 = function(request, response) {
        response.writeHead(200);
        response.end('success');
    },
    tFunc2 = function(request, response, args) {
        response.writeHead(200);
        response.end(args.id);
    },
    tObject = {
            doGet: tFunc1
    },
    http = require('http'),
    count = 0,
    // does test.done if all tests are done
    done = function() {
                count++;
                if(count === 6) {
                    httpServer.close();
                    test.done();
                    nodgineRouter.clearRoutes();
                }
            };
    httpServer.listen(1234);
    nodgineRouter.addRoute('/testroute', tFunc1);
    nodgineRouter.addRoute('/tataroute/:id', tFunc2);
    nodgineRouter.addRoute('/testobject', tObject);
    
    // do request to double path
    var options = {
            host: 'localhost',
            port: 1234,
            path: '/testroute',
            method: 'GET'
        };
    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){data+=chunk;});
        res.on('end', function() {
            test.equal(res.statusCode, 200);
            test.equal(data, 'success');
            done();
        });
    });
    
    //do a successful request to object
    options.path = '/testobject';
    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){data+=chunk;});
        res.on('end', function() {
            test.equal(res.statusCode, 200);
            test.equal(data, 'success');
            done();
        });
    });
    
    // do request to single path
    options.path = '/tataroute/test';
    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){data+=chunk;});
        res.on('end', function() {
            test.equal(res.statusCode, 200);
            test.equal(data, 'test');
            done();
        });
    });
    
    nodgineRouter.setDefaultRoute(function(request,response) {
        response.writeHead(200);
        response.end('default');
    });
    
    // do request to default route
    options.path = '/';
    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){data+=chunk;});
        res.on('end', function() {
            test.equal(res.statusCode, 200);
            test.equal(data, 'default');
            done();
        });
    });
    
    // do request to default route
    options.path = '/mugglefugg';
    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){data+=chunk;});
        res.on('end', function() {
            test.equal(res.statusCode, 200);
            test.equal(data, 'default');
            done();
        });
    });
    
    //do a not successful request to object
    options.path = '/testobject';
    options.method = 'POST';
    http.get(options, function(res) {
        var data = '';
        res.on('data', function(chunk){data+=chunk;});
        res.on('end', function() {
            test.equal(res.statusCode, 200);
            test.equal(data, 'default');
            done();
        });
    });
};
