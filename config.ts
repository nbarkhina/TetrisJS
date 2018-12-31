declare var requirejs, require;

requirejs.config({
    paths: {
        // "angular": "/node_modules/angular/angular"
    },
    urlArgs: function(id, url) {
        var args = '';
        if (url.indexOf('index') !== -1) {
            args = '?v=1'
        }
        return args;
    }
});

require(["index"]);