var Db = require('mongodb').Db;
var mongoose = require('mongoose');
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var sequenceProvider = require('./sequenceProvider').SequenceProvider;

var User = null; // mongoose model, populated on MapProvider construction
var Map = null; // mongoose model, populated on MapProvider construction

var MapProvider = function(host, port) {
	var version = 'oMapV1';
	
	console.log("host is" + host);
	console.log("port is" + port);
  
	// native connection
	this.db= new Db(version, new Server(host, port, {auto_reconnect: true}, {}));
	this.db.open(function(){});
  
	//mongoose backed collection
	this.mgDb = mongoose.createConnection("mongodb://" + host + ":" + port + '/mongoose_' + version);

	User = this.mgDb.model('user', new mongoose.Schema({ 
		mapId: {type: String, required: true},
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
	}));
	
	Map = this.mgDb.model('map', new mongoose.Schema({ 
		id: {type: String, required: true},
		objectVersion: { type: Number, 'default': 1},
	}));

};

MapProvider.prototype.natoAlfa = [
	"Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", 
	"Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"];

MapProvider.prototype.getMCollection = function(callback) {
	this.getCollection('maps', callback);
};

MapProvider.prototype.getSCollection = function(callback) {
	this.getCollection('sequences', callback);
};

MapProvider.prototype.getUCollection = function(callback) {
	this.getCollection('users', callback);
};

MapProvider.prototype.getCollection = function(collectionName, callback) {
	this.db.collection(collectionName, function(error, collection) {
		if ( error ) {
			console.log( error );		
			callback( error );
			return;
		} 
		callback(null, collection);
	});
};

MapProvider.prototype.getMCollection = function(callback) {
  this.db.collection('maps', function(error, maps_collection) {
    if ( error ) {
		console.log( error );
		callback( error );
		return;
	} 
    callback(null, maps_collection);
  });
};

MapProvider.prototype.getUCollection = function(callback) {
  this.db.collection('users', function(error, userCollection) {
    if ( error ) {
		console.log( error );		
		callback( error );
		return
	} 
    callback(null, userCollection);
  });
};

MapProvider.prototype.createMap = function(callback) {
    mapProvider = this;
	sequenceProvider.base36Counter('maps', 'sequence', function(error, seq) {
		if ( error ) {
			console.error( error );
			callback( error );
		} else {	
			var map = new Map({id: seq.toUpperCase()});
			map.save(function (err) {
			if (err) callback( error );// TODO handle the error
				console.log("testMap testMap testMap testMap testMap testMap testMap testMap testMap ")
				callback(null, map);
			});
		}
	});

};

MapProvider.prototype.createUser = function(mId,callback) {
	mapProvider = this;
	this.getUCollection(function(error, userColl) {
			sequenceProvider.counter('map_'+mId,'mapXUser',function(error, seq) {
				if ( error ) {
					console.error( error );
					callback( error );
				} else {
					var mod = (seq - 1) % 26;
					var multi =  Math.floor( (seq - 1) / 26);
					userColl.insert({mapId: mId, name: mapProvider.natoAlfa[mod] + ' ' + multi, pos: '', lastUpdate: '', objectVersion: '1'}, {safe:true}, function(error, data) {
					data[0].id = data[0]._id; // hack for now
					callback(null, data[0]);
					});
				}
			});
	});
};

MapProvider.prototype.getUsers = function(mId,callback) {
	this.getUCollection(function(error, userColl) {
		userColl.find({mapId: mId}).toArray(function(error, data) {
			if ( error ) {
				console.log( error );
				callback( error );
				return;
			}
			for (x in data) {
				data[x].id = data[x]._id;  //hack for now	
			}
			callback(null, data);
		});
	});
	
};

MapProvider.prototype.getMap = function(mapId, callback) {
	Map.findOne({ id: mapId }, function(error, map) {
		if( error ) {
			callback(error);
			return;
		}
		if (map == null) {
			callback("maps is null");
			return;
		} 
		callback(null, map);
	});
};

MapProvider.prototype.getUser = function(userId, callback) {
	this.getUCollection(function(error, user_collection) {
		if (error) callback(error);
		else {
			var oBi = null;
			try {
				var oBi =  new ObjectID(userId);
			} catch (err) {
				callback(err);
				return;
			}
			user_collection.findOne(
				{_id: oBi},
				function(error, user) {
					if (error) {
						console.log(error);
						callback(error);
						return;
					} 	
					if (user == null) {
						callback("user is null");
						return;
					}
					user.id = user._id;
					callback(null, user);
				}
			);
		}
    });
};

MapProvider.prototype.updateUser = function(user, mapId, callback) {
	this.getUCollection(function(error, userColl) {
		// should checkout findAndModify
		delete(user._id);
		userColl.findAndModify(
			{_id: new ObjectID(user.id)},
			[['_id', 'asc']],
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
	});
};

MapProvider.instance = null; 

MapProvider.getInstance = function() {
	console.log("singleton"); 
	if (this.instance == null) return this.instance = new MapProvider(process.env.MAP_PROVIDER_HOST || '127.0.0.1', process.env.MAP_PROVIDER_PORT || 27017);
	else return this.instance;
};

//Singleton
exports.MapProvider = MapProvider.getInstance();