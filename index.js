var fs = require('fs');

var defaults = {
    server: 'https://glimpseserver.herokuapp.com',
    port: '443',
    persistEvents: {}
    /** Usage: persistEvents: { "EventName" : ["Property", "Names", "To", "Persist"] } */
};
var Glimpse = function(id, glimpseFile, options) {
    this.options = defaults;
    this.glimpseFile = glimpseFile;
    this.id = id;
    if(options) {
        for(var key in options) {
            if(options.hasOwnProperty(key)) this.options[key] = options[key];
        }
    }
};

Glimpse.prototype.connect = function(callback) {
    var glimpseFile = this.glimpseFile;
    var id = this.id;
    var persistEvents = this.options.persistEvents;
    var socket = this.socket = require('socket.io-client')(this.options.server + ':' + this.options.port);

    socket.on('connect', function(){
        fs.readFile(glimpseFile, function(err, buf){
            if(err) return console.log('File error', err);

            socket.emit('glimpse:create', {
                id: id,
                impl: buf.toString('utf8'),
                persistEvents: persistEvents
            });

            if(callback) {
                callback(null, socket);
                callback = undefined;
            }

        });
    });

    socket.on('disconnect', function(){

    });
};

module.exports = Glimpse;