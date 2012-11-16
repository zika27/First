var http = require('http'),
    controller = require('./controller'),
    model = require('./model');

// Create a new HTTP server
http.createServer(controller.worker).listen(model.hostPort);
console.log('Server running at http://'+model.hostName+'/');