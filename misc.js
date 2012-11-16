var url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mime = require('./mime');

var misc = {} ;

misc.existsSync = fs.existsSync || path.existsSync;

misc.hasLastSlash = function(rPath){
    return /\/$/g.test(rPath);
};

misc.getPathName = function(req){
    return url.parse(req.url).pathname;
};

misc.getMIME = mime;

misc.isDir =  function(fsPath){
    return misc.existsSync(fsPath) && fs.statSync(fsPath).isDirectory() ? true : false;
};

misc.modifyUrlPath = function(sourceUrl, pathModifer){
    var parsedUrl = url.parse(sourceUrl);
    parsedUrl.pathname = pathModifer(parsedUrl.pathname);
    return url.format(parsedUrl);
};

misc.pipeFile = function(file, res, err){
    var stream = fs.createReadStream(file, { bufferSize: 64 * 1024 });
    stream.on('error', err);
    stream.pipe(res);
};

misc.getFile = function(file){
    return '' + fs.readFileSync(file);
};

module.exports = misc;
