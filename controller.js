var view = require('./view'),
    model = require('./model'),
    misc = require('./misc');

function folderRedirectAction(req, res, next){
    var rPath = misc.getPathName(req);
    var fsPath = model.getFsPath(rPath);
    if (!misc.hasLastSlash(rPath) && misc.existsSync(fsPath) &&  misc.isDir(fsPath)){
        res.writeHead(302, {'Location': misc.modifyUrlPath(req.url, function(p){return p + '/'})});
        res.end();
    } else {
        next();
    }
}
        
function folderIndexAction(req, res, next){
    var rPath = misc.getPathName(req);
    if (misc.hasLastSlash(rPath)){
        req.url = misc.modifyUrlPath(req.url, function(p){return p + model.indexName});
        var fsPath = model.getFsPath(rPath);
        if (!misc.existsSync(fsPath) && misc.existsSync(fsPath + model.dynamicExt)) {
            req.url = misc.modifyUrlPath(req.url, function(p){return p + model.dynamicExt});
        }
    }
    next();
}

function sendDynamicAction(req, res, next){
    var file = model.getFsPath( misc.getPathName(req));
    if (model.templateFile === file) {
        notFoundAction(req, res, next);
        return;
    }
    if (misc.existsSync(file) && model.isDynamicFile(file)){
        res.writeHead(200, {'Content-Type':misc.getMIME(file) });
        res.end(view.render(model.getFileData(file)));
    } else {
        next();
    }
}
        
function sendStaticAction(req, res, next){
    var file = model.getFsPath(misc.getPathName(req));
    if (misc.existsSync(file)){
        res.writeHead(200, {'Content-Type':misc.getMIME(file) });
        misc.pipeFile(file, res, next);
    } else {
        next();
    }
}

function notFoundAction(req, res, next){
    res.writeHead(404, {
        "Content-Type":"text/plain"
    });
    res.end("404 Not Found\n");
}

var controller = {};

controller.actions = [
    folderRedirectAction,
    folderIndexAction,
    sendDynamicAction,
    sendStaticAction,
    notFoundAction
];

controller.error = function(res, err) {
    console.log(err);
    if (!res.finshed) {
        res.writeHead(500, {
            "Content-Type":"text/plain"
        });
        res.end("500 Internal Server Error\n");
    }
};

controller.worker = function (req, res) {
    var i = 0;
    function next(err) {
        if (err) {
            controller.error(err);
            return;
        }

        if (!res.finished && i < controller.actions.length) {
            var action = controller.actions[i++];
            //console.log(action.name, req.url);
            action(req, res, next);
        }
    };
    next();
};


module.exports = controller;