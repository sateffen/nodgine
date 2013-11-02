/**
 * Unittest for the router
 */


var r = require("../Controller/Router.js"),
    httpServer = require("http").createServer(r.route);

exports.getEncoding = function(test) {
    test.equal(r.getEncoding(), "utf-8");
    test.done();
};

exports.setEncoding = function(test) {
    r.setEncoding("ASCII");
    test.equal(r.getEncoding(), "ASCII");
    r.setEncoding("utf-8");
    test.equal(r.getEncoding(), "utf-8");
    test.done();
};

exports.getDefaultRoute = function(test) {
    test.equal(r.getDefaultRoute(), null);
    test.done();
};

exports.setDefaultRoute = function(test) {
    var tFunc1 = function(){return 0;},
        tFunc2 = function(){return 1;};
    r.setDefaultRoute(tFunc1);
    test.equal(r.getDefaultRoute(), tFunc1);
    r.setDefaultRoute(tFunc2);
    test.equal(r.getDefaultRoute(), tFunc2);
    test.done();
};

exports.getRoute = function(test) {
    var tFunc = function(){return;};
    r.addRoute("/testGetRoute", tFunc);
    test.equal(r.getRoute("/tttt"), undefined);
    test.equal(r.getRoute("/testGetRoute").callback, tFunc);
    test.done();
    r.clearRoutes();
};

exports.addRoute = function(test) {
    r.addRoute("/testAddRoute", function(){return;});
    r.addRoute("/testAddRoute2", function(){return;});
    test.ok(r.getRoute("testAddRoute"));
    test.ok(r.getRoute("testAddRoute2"));
    test.done();
    r.clearRoutes();
};

exports.clearRoutes = function(test) {
    r.addRoute("/testclearRoutes", function(){return;});
    r.addRoute("/testclearRoutes2", function(){return;});
    r.clearRoutes();
    test.ok(!r.getRoute("/testclearRoutes"));
    test.ok(!r.getRoute("/testclearRoutes2"));
    test.done();
};

exports.route = function(test) {
    var tFunc1 = function(request, response, args) {
        arg = args;
        response.writeHead(200);
        response.end("success");
    },
    tFunc2 = function(request, response, args) {
        response.writeHead(200);
        response.end(args.id);
    },
    tObject = {
            doGet: tFunc1
    },
    http = require("http"),
    count = 0,
    // does test.done if all tests are done
    done = function() {
                count++;
                if(count == 6) {
                    httpServer.close();
                    test.done();
                    r.clearRoutes();
                }
            };
    httpServer.listen(1234);
    r.addRoute("/testroute", tFunc1);
    r.addRoute("/tataroute/:id", tFunc2);
    r.addRoute("/testobject", tObject);
    
    // do request to double path
    var options = {
            host: "localhost",
            port: 1234,
            path: "/testroute",
            method: "GET"
        };
    http.get(options, function(res) {
        var data = "";
        res.on("data", function(chunk){data+=chunk;});
        res.on("end", function() {
            test.equal(res.statusCode, 200);
            test.equal(data, "success");
            done();
        });
    });
    
    //do a successful request to object
    options.path = "/testobject";
    http.get(options, function(res) {
        var data = "";
        res.on("data", function(chunk){data+=chunk;});
        res.on("end", function() {
            test.equal(res.statusCode, 200);
            test.equal(data, "success");
            done();
        });
    });
    
    // do request to single path
    options.path = "/tataroute/test";
    http.get(options, function(res) {
        var data = "";
        res.on("data", function(chunk){data+=chunk;});
        res.on("end", function() {
            test.equal(res.statusCode, 200);
            test.equal(data, "test");
            done();
        });
    });
    
    r.setDefaultRoute(function(request,response, args) {
        arg = args;
        response.writeHead(200);
        response.end("default");
    });
    
    // do request to default route
    options.path = "/";
    http.get(options, function(res) {
        var data = "";
        res.on("data", function(chunk){data+=chunk;});
        res.on("end", function() {
            test.equal(res.statusCode, 200);
            test.equal(data, "default");
            done();
        });
    });
    
    // do request to default route
    options.path = "/mugglefugg";
    http.get(options, function(res) {
        var data = "";
        res.on("data", function(chunk){data+=chunk;});
        res.on("end", function() {
            test.equal(res.statusCode, 200);
            test.equal(data, "default");
            done();
        });
    });
    
    //do a not successful request to object
    options.path = "/testobject";
    options.method = "POST";
    http.get(options, function(res) {
        var data = "";
        res.on("data", function(chunk){data+=chunk;});
        res.on("end", function() {
            test.equal(res.statusCode, 200);
            test.equal(data, "default");
            done();
        });
    });
};
