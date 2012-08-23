
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// map provider is a singlon
var mapProvider = require('./mapProvider').MapProvider;

var clients = [];

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/m/*', routes.index);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
 
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('getUsersByMapId', function (mapId) {
	mapProvider.usersByMapId(mapId,
		function(users) {
			socket.emit('usersClientUpdate',JSON.stringify(users));
		});
  });
  socket.on('userUpdate', function (user) {
    clients[user.id] = socket;
	mapProvider.saveUser(user,function () {
		mapProvider.usersByMapId(user.mapId,
		function(users) {
		    for (id in users) {
				(function (id) {
					mapProvider.isActive(id, function (test) {
						if (test) clients[id].emit('usersClientUpdate',JSON.stringify(users));
					});
				})(id);
			}
		});
	});
  });
});
