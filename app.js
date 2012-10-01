
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
app.get('/map*', routes.index);
app.get('/m', routes.index);
app.get('/m/*', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function initUser(data, socket) {
	socket.join(data.mapId);
	//Transmit other users back
	mapProvider.getUsers(data.mapId, function(error, users) {
		socket.emit('usersUpdate',JSON.stringify(users));
	});
		
	//Transmit inited data to everyone	
	if (data.id) {
		console.log("user update from init");
		console.log(data);
		mapProvider.getUser(data.id, function (error, user) {
			if ( error ) console.log( error );
			socket.emit('initUser', JSON.stringify(user));
			io.sockets.in(data.mapId).emit('userUpdate',JSON.stringify(user));
		});
	} else {
		mapProvider.createUser(data.mapId, function(error, user) {
			if ( error ) console.log( error );
			socket.emit('initUser', JSON.stringify(user));
			io.sockets.in(data.mapId).emit('userUpdate',JSON.stringify(user));
			socket.set('userId',user.id);
		});
	}
}
 
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	
	socket.on('initUser', function(data) {
		if (data.mapId) initUser(data, socket);
		else mapProvider.createMap(function (error, map) {
		if (error) console.log(error);
			data.mapId = map.id;
			initUser(data, socket);
		});
		
	});
  
	socket.on('userUpdate', function (data) {
		var user = data.user;
		console.log("user update");
		mapProvider.updateUser(user, function (error, user) {
			if ( error ) console.log( error );
			else io.sockets.in(user.mapId).emit('userUpdate',JSON.stringify(user));
		});
	});
	
	socket.on('disconnect', function () {
		socket.get('userId', function (err, userId) {
                    if (err){
                        console.log("disconnect error" + err);
                        console.dir(err);
                        return;
                    }
                    console.log('UserId:' + userId +' disconnected');
                    if (!userId) return;

                    mapProvider.getUser(userId.toString(), function(error, user) {
                        if (error){
                            console.log("failed to find user:" + userId);
                            console.log(error);
                            return;
                        }
                        user.connectStatus = false;
                        socket.emit('updateUser', JSON.stringify(user));
                        io.sockets.in(user.mapId).emit('userUpdate',JSON.stringify(user));
                    });
                        
		});
	});
});
