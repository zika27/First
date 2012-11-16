var model = require('./model');

var view = {};

view.render = function(data) {
    var template = model.template;
    Object.keys(data).forEach(function(key){
        template = template.replace(new RegExp('%'+key+'%', 'g'), data[key]);
    });
    return template;
};

module.exports = view;