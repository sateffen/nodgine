/**
 * Unittest for the router object
 */
'use strict';
/**
 * Reference to the router object
 *
 * @private
 * @type {$ROUTER}
 **/
var mNodgineRouter = require('../src/bootstrap.js').$ROUTER,

    /**
     * Simple webserver for the tests
     *
     * @private
     * @type {http-server}
     **/
    mHttpServer = require('http').createServer(mNodgineRouter.route);

/*
* Tests the $ROUTER.getEncoding function by getting the default value
*/
exports.getEncoding = function(test) {
    test.equal(mNodgineRouter.getEncoding(), 'utf8', 'The default value of getEncoding should be \'utf8\', not ' + mNodgineRouter.getEncoding());
    test.done();
};

/*
* Tests the $ROUTER.setEncoding function
*/
exports.setEncoding = function(test) {
    // sets encoding to ascii
    mNodgineRouter.setEncoding('ascii');
    test.equal(mNodgineRouter.getEncoding(), 'ascii', 'The encoding should be \'ascii\', but was ' + mNodgineRouter.getEncoding());
    // sets encoding to undefined without checking
    mNodgineRouter.setEncoding('undefined', false);
    test.equal(mNodgineRouter.getEncoding(), 'undefined', 'The encoding should be \'undefined\', but was ' + mNodgineRouter.getEncoding());
    // sets encoding to utf8
    mNodgineRouter.setEncoding('utf8');
    test.equal(mNodgineRouter.getEncoding(), 'utf8', 'The encoding should be \'utf8\', but was ' + mNodgineRouter.getEncoding());

    // try to set undefined as encoding, this has to fail
    try {
        mNodgineRouter.setEncoding('undefined');
        test.ok(false, 'setEncoding(\'undefined\') should throw an error.');
    }
    catch (e) {
        // this should happen, cause undefined can't be set as encoding
        test.ok(true, e);
    }

    test.done();
};

/*
* Tests the $ROUTER.getDefaultRoute function by getting the default route, which is unset
*/
exports.getDefaultRoute = function(test) {
    test.equal(mNodgineRouter.getDefaultRoute(), null, 'The default-route wasn\'t set, so it should be the default value \'null\'');
    test.done();
};

/*
* Tests the $ROUTER.setDefaultRoute function
*/
exports.setDefaultRoute = function(test) {
    // setup some test default routes
    var tFunc1 = function(){return 0;},
        tFunc2 = function(){return 1;};
    // sets first default route
    mNodgineRouter.setDefaultRoute(tFunc1);
    test.equal(mNodgineRouter.getDefaultRoute(), tFunc1, 'The default route should be equal to the first test-function');
    // sets second default route
    mNodgineRouter.setDefaultRoute(tFunc2);
    test.equal(mNodgineRouter.getDefaultRoute(), tFunc2, 'The default route should be equal to the second test-function');
    test.done();
};

/*
* Tests the $ROUTER.getRoute function by setting up a default test-route and receives it
*/
exports.getRoute = function(test) {
    // setup a test function
    var tFunc = function(){};
    // adds the test function as route
    mNodgineRouter.addRoute('/testGetRoute', tFunc);
    test.equal(mNodgineRouter.getRoute('/tttt'), undefined, 'This route is never set, so it should be ');
    test.equal(mNodgineRouter.getRoute('/testGetRoute').callback, tFunc, 'The result of the set function should be the set function');
    test.done();
    // cleanup the routes
    mNodgineRouter.clearRoutes();
};

/*
* Tests the $ROUTER.addRoute function by setting up a default test-route and receives it
*/
exports.addRoute = function(test) {
    // adds two testroutes
    mNodgineRouter.addRoute('/testAddRoute', function(){});
    mNodgineRouter.addRoute('/testAddRoute2', function(){});
    // requests the two testroutes
    test.ok(mNodgineRouter.getRoute('/testAddRoute'), 'This testroute should exist');
    test.ok(mNodgineRouter.getRoute('/testAddRoute2'), 'This testroute should exist');
    test.done();
    // cleanup the routes
    mNodgineRouter.clearRoutes();
};

/*
* Tests the $ROUTER.clearRoutes function by setting up a default test-route and receives it
*/
exports.clearRoutes = function(test) {
    // setup two testroutes
    mNodgineRouter.addRoute('/testclearRoutes', function(){});
    mNodgineRouter.addRoute('/testclearRoutes2', function(){});
    // cleanup the testroutes
    mNodgineRouter.clearRoutes();
    // the 2 routes shouln't exist
    test.ok(!mNodgineRouter.getRoute('/testclearRoutes'));
    test.ok(!mNodgineRouter.getRoute('/testclearRoutes2'));
    test.done();
};

/*
 * Tests the $ROUTER.route function by setting up a default test-route and receives it
 */
exports.route = function(test) {
    // setup first testfunction
    var tFunc1 = function(request, response) {
        response.writeHead(200);
        response.end('success');
    },
    // setup second testfunction
    tFunc2 = function(request, response, args) {
        response.writeHead(200);
        response.end(args.id);
    },
    // setup test object
    tObject = {
            doGet: tFunc1
    },
    // reference to http-object
    http = require('http'),
    // tmp counter for the requests
    count = 0,
    // does test.done if all tests are done
    done = function() {
                count++;
                if(count === 6) {
                    mHttpServer.close();
                    test.done();
                    mNodgineRouter.clearRoutes();
                }
            };
    // start http server
    mHttpServer.listen(1234);
    // setup the three test-routes
    mNodgineRouter.addRoute('/testroute', tFunc1);
    mNodgineRouter.addRoute('/tataroute/:id', tFunc2);
    mNodgineRouter.addRoute('/testobject', tObject);
    
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

    // setup default route
    mNodgineRouter.setDefaultRoute(function(request,response) {
        request.test = 'noJSHint';
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
