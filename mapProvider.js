var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var MapProvider = function(host, port) {
  console.log("host is" + host);
  console.log("port is" + port);
  this.db= new Db('oMap', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


MapProvider.prototype.mapsById = new Array();

MapProvider.prototype.mapCount = 0;

MapProvider.prototype.getMCollection = function(callback) {
  this.db.collection('maps', function(error, maps_collection) {
    if ( error ) {
		console.log( error );
		callback( error );
	} 
    else callback(null, maps_collection);
  });
};

MapProvider.prototype.getUCollection = function(callback) {
  this.db.collection('users', function(error, userCollection) {
    if ( error ) {
		console.log('usersusersusersusersusersusersusersusersusersusersusersusersusersusers');	
		console.log( error );
		
		callback( error );
	} 
    else callback(null, userCollection);
  });
};


MapProvider.prototype.createMap = function(callback) {

	this.getMCollection(function(error, mapColl) {
		mapColl.insert({objectVersion: '0'}, function(error, data) {
			if ( error ) {
				//console.log( error );
				callback( error );
			} else {
				data[0].id = data[0]._id; // hack for now
				callback(data[0]);;
			}
		});
	});
	
};

MapProvider.prototype.createUser = function(mId,callback) {

	this.getUCollection(function(error, userColl) {
		userColl.insert({mapId: mId, name: 'test', pos: '', lastUpdate: '', objectVersion: '1'}, function(error, data) {
			data[0].id = data[0]._id; // hack for now
			callback(null, data[0]);
		});
	});
	
};

MapProvider.prototype.getUsers = function(mId,callback) {
	this.getUCollection(function(error, userColl) {
		userColl.find({mapId: mId}).toArray(function(error, data) {
			for (x in data) {
				data[x].id = data[x]._id;  //hack for now	
			}
			callback(data);
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
		}
		
        maps_collection.findOne({_id: oBi}, function(error, map) {
			if( error ) {
				callback(error);
			} else {	
				console.log(map);
				if (map == null) {
					callback("maps is null");
				}
				map.id = map._id;
				callback(null, map);
			}
        });
      }
    });
};

MapProvider.prototype.getUser = function(userId, callback) {
	this.getUCollection(function(error, user_collection) {
      if( error ) {
		callback(error);
      } else {
		var oBi = null;
		try {
			var oBi =  new ObjectID(userId);
			console.log(userId+"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
		} catch (err) {
			callback(err);
		}
		
        user_collection.findOne({_id: oBi}, function(error, user) {
			if( error ) {
				console.log('errrrrrrooorrr');
				console.log(error);
				callback(error);
			} else {	
				console.log('create userrrrrrrrr');
				console.log(user);
				if (user == null) {
					callback("user is null");
				}
				user.id = user._id;
				callback(null, user);
			}
        });
      }
    });
};



MapProvider.prototype.updateUser = function(user, mapId, callback) {
	this.getUCollection(function(error, userColl) {
		// should checkout findAndModify
		delete(user._id);
		userColl.findAndModify({_id: new ObjectID(user.id)}, [['_id','asc']], {'$set': user},  {}, function(error, data) {
			if ( error ) {
				console.log( error );
				callback( error );
			} else {
				callback(null, data);
			}
		});
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