var mongoose = require('mongoose');

var sequenceProvider = require('./sequenceProvider').SequenceProvider;

var User = null; // mongoose model, populated on MapProvider construction
var Map = null; // mongoose model, populated on MapProvider construction

var MapProvider = function(host, port) {
	var version = 'oMapV4';
	  
	//mongoose backed collection
	this.mgDb = mongoose.createConnection("mongodb://" + host + ":" + port + '/' + version);

	var userSchema = new mongoose.Schema(
		{ 
			id: {type: String, required: true},
			name: {type: String, required: true},
			connectStatus: { type: Boolean, 'default': true},
			objectVersion: { type: Number, 'default': 1},
			pos: { 
				timestamp:  { type: Date, default: Date.now },
				coords: {
					longitude: {type: Number},
					accuracy: {type: Number},
					latitude: {type: Number} 
				} 
			} 
		},
		{ id: false }
	);
	
	var mapSchema = new mongoose.Schema(
		{ 
			id: {type: String, required: true},
			objectVersion: { type: Number, 'default': 1}
		},
		{ 
			id: false 
		}
	);
	
	User = this.mgDb.model('user', userSchema);	
	
	Map = this.mgDb.model('map', mapSchema);

};


MapProvider.prototype.natoAlfa = [
	"Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", 
	"Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"];


MapProvider.prototype.createMap = function(callback) {
    mapProvider = this;
	sequenceProvider.base36Counter('maps', 'sequence', function(error, seq) {
		if ( error ) {
			console.error( error );
			callback( error );
		} else {	
			var map = new Map({id: seq.toUpperCase()});
			map.save(function (err) {
				if (err) {
					callback( error );// TODO handle the error
					return;
				}
				callback(null, map);
			});
		}
	});

};


MapProvider.prototype.createUser = function(mId,callback) {
	var mapProvider = this;
	sequenceProvider.counter('map_'+mId,'mapXUser',function(error, seq) {
		if ( error ) {
			console.error( error );
			callback( error );
			return;
		} else {
			var mod = (seq - 1) % 26;
			var multi =  Math.floor( (seq - 1) / 26);
			var user = new User({id: mId + ":" + seq, mapId: mId, name: mapProvider.natoAlfa[mod] + ' ' + multi, pos: '', lastUpdate: '', objectVersion: '1'});
			user.save(function (err) {
				if (err) {
					callback( error );// TODO handle the error
					return;
				}
				console.log(user);
				callback(null, user);
			});
		}
	});
};


MapProvider.prototype.getUsers = function(mId,callback) {
	User.find({mapId: mId},function(error, data) {
		if ( error ) {
			console.log( error );
			callback( error );
			return;
		}
		callback(null, data);
	});	
};


MapProvider.prototype.getMap = function(mId, callback) {
	Map.findOne({ id: mId }, function(error, map) {
		if( error ) {
			console.log(error);
			callback(error);
			return;
		}
		if (map == null) {
			callback("maps is null");
			return;
		}
		console.log('here');
		console.log(map);
		callback(null, map);
	});
};


MapProvider.prototype.getUser = function(userId, callback) {
	User.findOne({ id: userId }, function(error, user) {
		if( error ) {
			callback(error);
			return;
		}
		if (user == null) {
			callback("maps is null");
			return;
		} 
		callback(null, user);
	});
};


MapProvider.prototype.updateUser = function(user, mapId, callback) {
	var userId = user.id;
	delete(user._id); // don't allow modification
	delete(user.id); // don't allow modification
	User.findOneAndUpdate(
		{id: userId},
		{'$set': user},
		{new: true},
		function(error, data) {
			if ( error ) {
				console.log( error );
				return;
			}
			console.log('update user');
			console.log(data);
			callback(null, data);
		}
	);
};


MapProvider.instance = null; 


MapProvider.getInstance = function() {
	console.log("singleton"); 
	if (this.instance == null) return this.instance = new MapProvider(process.env.MAP_PROVIDER_HOST || '127.0.0.1', process.env.MAP_PROVIDER_PORT || 27017);
	else return this.instance;
};

//Singleton
exports.MapProvider = MapProvider.getInstance();