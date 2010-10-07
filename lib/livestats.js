var http = require('http'),
    sys  = require('sys'),
    nodeStatic = require('node-static/lib/node-static');
    faye = require('Faye 0.5.2/faye-node');
    url = require('url');
function LiveStats(options) {
    if (!(this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }
    var self = this;

    self.settings = {
        port: options.port,
        quakeServer: {
            hostname: options.quakeServer.hostname
            , port: options.quakeServer.port || 80
        }
    };
    self.init();
}
;

LiveStats.prototype.init = function() {
    var self = this;
    self.bayeux = self.createBayeuxServer();
    self.httpServer = self.createHTTPServer();

    self.bayeux.attach(self.httpServer);
    self.httpServer.listen(self.settings.port);
    sys.log('Server Started on PORT' + self.settings.port);
};

LiveStats.prototype.createBayeuxServer = function() {
    var self = this;
    var bayeux = new faye.NodeAdapter({
        mount: '/faye',
        timeout: 45
    });
    return bayeux;
};

LiveStats.prototype.createHTTPServer = function() {
    var self = this;
    var server = http.createServer(function(request, response) {
        var file = new nodeStatic.Server('./public', {
            cache: false
        });
        setInterval(function() {
            var client = http.createClient(self.settings.quakeServer.port, self.settings.quakeServer.hostname);
            var request = client.request('GET', '/earthquakes', {
                'host': 'localhost'
            });
            request.addListener('response', function (response) {
                response.setEncoding('utf8');
                var body = '';
                response.addListener('data', function (chunk) {
                    body += chunk;
                });
                response.addListener('end', function () {
                    var json = JSON.parse(body);
                    for (i = 0; i < json.length; i++) {
                        self.bayeux.getClient().publish('/stat', {
                              content: json[i].content
                            , latitude: json[i].latitude
                            , longitude: json[i].longitude
                            , place: json[i].place
                        });

                    }
                });
            });
            request.end();
        }, 60000);
        request.addListener('end', function() {
            var location = url.parse(request.url, true),
                    params = (location.query || request.headers);
            if (location.pathname == '/config.json' && request.method == "GET") {
                response.writeHead(200, {
                    'Content-Type': 'application/x-javascript'
                });
                var jsonString = JSON.stringify({
                    port: self.settings.port
                })
                response.write(jsonString);
                response.end();
            }
            else {
                file.serve(request, response);
            }
        });
    });
    return server;
}
module.exports = LiveStats;
