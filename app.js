
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
	console.log('emit users[]');
	mapProvider.getUsers(mapId,
	function(error, users) {
		for (uX in users) {
			if (clients[users[uX].id]) clients[users[uX].id].emit('usersUpdate',JSON.stringify(users));
		}
	});
};

function emitUserUpdate(user,mapId) {
	console.log('emit users[]');
	mapProvider.getUsers(mapId,
	function(error, users) {
		for (uX in users) {
			if (clients[users[uX].id]) clients[users[uX].id].emit('userUpdate',JSON.stringify(user));
		}
	});
};

io.sockets.on('connection', function (socket) {
	socket.on('initUser', function(data) {
		if (data.id) {
			console.log('user id is ' +data.id);
			mapProvider.getUser(data.id, function(error, user) {
				clients[user.id] = socket;
				socket.emit('initUser', JSON.stringify(user));
				emitUsersUpdate(data.mapId);
			});
		} else {
			mapProvider.createUser(data.mapId, function(error, user) {
				clients[user.id] = socket;
				socket.emit('initUser', JSON.stringify(user));
				emitUsersUpdate(data.mapId);
			});
		}
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
		console.log("user update");
		mapProvider.updateUser(user, mapId, function (error, user) {
			if ( error ) console.log( error );
			else emitUserUpdate(user,mapId);
		});
	});
});
