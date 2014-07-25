
var mPath = require('path'),
    mFs = require('fs');


function mStaticFileController(aPath, aRequest, aResponse, aArgs) {
    'use strict';
    var stream = mFs.createReadStream(aPath);
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