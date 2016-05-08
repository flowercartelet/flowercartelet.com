'use strict';

require('../lib/polyfill');
var env = require('process').env;
var app = require('../lib/server').app;

var port = env.PORT || 8000;
app.listen(port);
