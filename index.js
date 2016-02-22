var app = require('http').createServer(function(){});
var io = require('socket.io')(app);
var fs = require('fs');
var _port;
var _ip;

module.exports={
    init: function(port, ip){
        _port = port || 80;
        _ip = ip;
        app.listen(port);
    },
    create: function(glimpse, namespace, actions){
        if(!_port){
            console.log('You must call init before creating ...');
            return;
        }

        var nsp = io.of(namespace);

        nsp.on('connection', function (socket) {
            socket.on('init', function(){
                fs.readFile(glimpse, function(err, buf){
                    socket.emit('visual', { impl: buf.toString('utf8') });
                });
            });

            socket.on('disconnect', function () {
                socket.disconnect();
            });

            if(actions){
                for(var i=0; i< actions.length; i++){
                    socket.on(actions[i].on, actions[i].do);
                }
            }
        });

        require('dns').lookup(require('os').hostname(), function (err, add) {

            var ip = _ip || add;
            var http = require('http');
            var options = {
                host: 'pbi-glimpse.azurewebsites.net',
                port: 80,
                path: '/?port=' + _port + '&url=' + ip + ':'+ _port + '/'+namespace,
                method: 'GET'
            };

            http.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('device: ' + namespace);
                    console.log('addr: ' + add);
                    console.log('ID: ' + chunk);
                });
            }).end();
        });

        return nsp;
    }
}