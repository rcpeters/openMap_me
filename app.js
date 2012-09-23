
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// map provider is a singlon
var mapProvider = require('./project_modules/data_providers/mapProvider').MapProvider;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser()); 
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/m', routes.index);
app.get('/m/*', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
 
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	
	socket.on('initUser', function(data) {
		var mapId = data.mapId;
		socket.join(mapId);
	
		//Transmit other users back
		mapProvider.getUsers(data.mapId, function(error, users) {
			socket.emit('usersUpdate',JSON.stringify(users));
		});
		
		//Transmit inited user to everyone
		if (data.id) {
			console.log('user id is ' +data.id);
			mapProvider.getUser(data.id, function(error, user) {
				socket.emit('initUser', JSON.stringify(user));
				io.sockets.in(mapId).emit('userUpdate',JSON.stringify(user));
				socket.set('userId',user.id);
			});
		} else {
			mapProvider.createUser(mapId, function(error, user) {
				socket.emit('initUser', JSON.stringify(user));
				io.sockets.in(mapId).emit('userUpdate',JSON.stringify(user));
				socket.set('userId',user.id);
			});
		}
	});
  
	socket.on('userUpdate', function (data) {
		var user = data.user;
		var mapId = data.mapId; 
		console.log("user update");
		mapProvider.updateUser(user, mapId, function (error, user) {
			if ( error ) console.log( error );
			else io.sockets.in(mapId).emit('userUpdate',JSON.stringify(user));
		});
	});
	
	socket.on('disconnect', function () {
		socket.get('userId', function (err, userId) {
			console.log('User' + userId +' disconnected');
		});
	});
});
