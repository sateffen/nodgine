#!/usr/bin/env node

'use strict';

/**
 * @name mNodgine
 * @private
 * @type {Nodgine}
 */
var mNodgine = require('../.'),
    /**
     * @name mArgs
     * @private
     * @type {Array}
     */
    mArgs = process.argv.slice(2),
    /**
     * @name mFs
     * @private
     * @type {fs}
     */
    mFs = require('fs'),
    /**
     * @name mPath
     * @private
     * @type {path}
     */
    mPath = require('path');

// check if the command was called with a simple json file
if (mArgs[0] && mPath.extname(mArgs[0]) === '.json') {
    // and if the file exists
    if (mFs.existsSync(mArgs[0])) {
        // load it
        mNodgine.loadFromFile(mPath.resolve(process.cwd(), mArgs[0]));
        // start the application
        mNodgine.$APPLICATION.runApplication()
        // and tell the user the success
        console.log('Load successful');
    }
    // but if it doesn't exist
    else {
        // the user has to know as well
        console.log('Can\'t find ' + mArgs[0]);
    }
}
// but if the user uses this wrong
else {
    // tell the user how to use it right
    console.log('Usage:');
    console.log('    nodgine <filename>');
    console.log('Example:');
    console.log('    nodgine test.json');
}
