#!/usr/bin/env node

'use strict';

var mNodgine = require('../'),
    mArgs = process.argv.slice(2),
    mFs = require('fs'),
    mPath = require('path');

if (mArgs[0] && mPath.extname(mArgs[0]) === '.json') {
    if (mFs.existsSync(mArgs[0])) {
        mNodgine.loadFromFile(mPath.resolve(process.cwd(), mArgs[0]));
        mNodgine.$APPLICATION.runApplication()
        console.log('Load successful');
    }
    else {
        console.log('Can\'t find ' + mArgs[0]);
    }
}
else {
    console.log('Usage:');
    console.log('    nodgine <filename>');
    console.log('Example:');
    console.log('    nodgine test.json');
}