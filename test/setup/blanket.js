'use strict';

var path = require('path');
var blanket = require('blanket');
var srcDir = path.join(__dirname, '../../src');

blanket({
    // Only files that match the pattern will be instrumented
    pattern: srcDir
});
