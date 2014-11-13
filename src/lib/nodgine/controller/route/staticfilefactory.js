
var mPath = require('path'),
    mFs = require('fs');

function mGetContentTypeHeader(aFileName) {
    var extension = mPath.extname(aFileName);

    switch(extension) {
        case '.htm':
        case '.html':
            return {'Content-Type': 'text/html'};
        case '.gif':
            return {'Content-Type': 'image/gif'};
        case '.jpeg':
        case '.jpg':
            return {'Content-Type': 'image/jpeg'};
        case '.png':
            return {'Content-Type': 'image/png'};
        case '.js':
            return {'Content-Type': 'text/javascript'};
        case '.css':
            return {'Content-Type': 'text/css'};
        case '.svg':
            return {'Content-Type': 'image/svg+xml'};
        case '.pdf':
            return {'Content-Type': 'application/pdf'};
        case '.txt':
            return {'Content-Type': 'text/plain'};
        case '.csv':
            return {'Content-Type': 'text/comma-separated-values'};
        case '.tar':
            return {'Content-Type': 'application/x-tar'};
        case '.zip':
            return {'Content-Type': 'application/zip'};
    }
}

function mStaticFileController(aPath, aRequest, aResponse, aArgs) {
    'use strict';
    var stream = mFs.createReadStream(aPath);
    aResponse.writeHead(200, mGetContentTypeHeader(aPath));
    aResponse.pipe(stream);
}

function mStaticDirectoryController(aPath, aRequest, aResponse, aArgs) {
    'use strict';
    if (aArgs['*']) {
        var requestedFile = mPath.normalize(aArgs['*'].replace('..', '.'));
        requestedFile = mPath.join(aPath, requestedFile);
        mFs.exists(requestedFile, function (doesExist) {
            if (doesExist) {
                mFs.lstat(requestedFile, function (error, stats) {
                    if (error) {
                        aResponse.writeHead(404);
                        aResponse.end();
                    }
                    else {
                        if (stats.isFile()) {
                            aResponse.writeHead(200, mGetContentTypeHeader(requestedFile));
                            aResponse.pipe(mFs.createReadStream(requestedFile));
                        }
                        else {
                            requestedFile = mPath.join(requestedFile, '/index.html');
                            mFs.exists(requestedFile, function (doesExist) {
                                if (doesExist) {
                                    aResponse.pipe(mFs.createReadStream(requestedFile));
                                }
                                else {
                                    aResponse.writeHead(404);
                                    aResponse.end();
                                }
                            });
                        }
                    }
                });
            }
            else {
                aResponse.writeHead(404);
                aResponse.end();
            }
        });
    }
    else {
        aResponse.writeHead(404);
        aResponse.end();
    }
}

module.exports = function (aPath) {
    'use strict';
    aPath = mPath.resolve(aPath);

    var stats = mFs.lstatSync(aPath);
    if (stats.isFile()) {
        return mStaticFileController.bind(null, aPath);
    }
    else if (stats.isDirectory()) {
        return mStaticDirectoryController.bind(null, aPath);
    }
    else {
        throw 'Nodgine_Controller_Route_StaticFileFactory: ' + aPath + 'cannot be resolved';
    }
};
