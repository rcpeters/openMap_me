var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var sequenceProvider = require('./sequenceProvider').SequenceProvider;

var MapProvider = function(host, port) {
  console.log("host is" + host);
  console.log("port is" + port);
  this.db= new Db('oMap', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

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
	sequenceProvider.getNextS('test',function(error, seqObj) {
			if ( error ) {
				console.log('SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq ');
				console.log( error );
				callback( error );
			} else {
				console.log('SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq SEq ');
				console.log(seqObj);
			}
	});

	this.getMCollection(function(error, mapColl) {
		mapColl.insert({objectVersion: '0'}, {safe:true}, function(error, data) {
			if ( error ) {
				console.error( error );
				callback( error );
				return;
			}
			if (!data || !data[0]) {
				callback("no match for map");
				return;
			}
			var map = data[0];
			map.id = map._id; // hack for now
			callback(null, map);
		});
	});
};

MapProvider.prototype.createUser = function(mId,callback) {
	this.getUCollection(function(error, userColl) {
		userColl.insert({mapId: mId, name: 'test', pos: '', lastUpdate: '', objectVersion: '1'}, {safe:true}, function(error, data) {
			data[0].id = data[0]._id; // hack for now
			callback(null, data[0]);
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
	this.getMCollection(function(error, maps_collection) {
      if( error ) {
		callback(error);
      } else {
		var oBi = null;
		try {
			var oBi =  new ObjectID(mapId);
		} catch (err) {
			callback(err);
			return;
		}
        maps_collection.findOne({_id: oBi}, function(error, map) {
			if( error ) {
				callback(error);
				return;
			}
			if (map == null) {
				callback("maps is null");
				return;
			} 
			map.id = map._id;
			callback(null, map);
        });
      }
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
				callback(null, data);
			}
		);
	});
};

MapProvider.prototype.getNextS = function(sequenceId, callback) {
	this.getSCollection(function(error, userColl) {
		// should checkout findAndModify
		userColl.findAndModify(
			{_id: sequenceId},
			[['_id', 'asc']],
			{'$inc': {"seq":1}},
			{new: true, upsert:true},
			function(error, data) {
				console.log(data);
				if ( error ) {
					console.log( error );
					return;
				}
				callback(null, data);
			}
		);
	});
};

MapProvider.instance = null; 

MapProvider.getInstance = function() {
	console.log("singleton"); 
	if (this.instance == null) return this.instance = new MapProvider('127.0.0.1', 27017);
	else return this.instance;
};

//Singleton
exports.MapProvider = MapProvider.getInstance();