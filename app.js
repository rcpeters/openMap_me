
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

function emitUsersUpdate(mapId) {
	mapProvider.getMap(mapId,
	function(map) {
		console.log("mmmmmmmmmmmmmmmmmmmm");
		console.log(map);
		console.log("ssssssssssssssssssss");
		console.log(JSON.stringify(map));
		var users = map.users;
		for (uX in users) {
			console.log("emit tooooooooooooooooo:" +users[uX].id)
			clients[users[uX].id].emit('mapUpdate',JSON.stringify(map));
		}
	});
};

io.sockets.on('connection', function (socket) {
	socket.on('initUser', function(data) {
		mapProvider.createUser(data.mapId, function(user) {
			clients[user.id] = socket;
			socket.emit('initUser', JSON.stringify(user));
			emitUsersUpdate(data.mapId);
		});
		//console.log("create user for map", data.mapId);
	});
  
	socket.on('getUsersByMapId', function (mapId) {
		mapProvider.getMap(mapId,
			function(map) {
				socket.emit('usersClientUpdate',JSON.stringify(map));
			});
	});
  
	socket.on('userUpdate', function (data) {
		var user = data.user;
		var mapId = data.mapId; 
		clients[user.id] = socket;
		mapProvider.updateUser(user, mapId, function () {
			emitUsersUpdate(mapId)
		});
	});
});
