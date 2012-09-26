var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var SequenceProvider = function(host, port) {
  console.log("host is" + host);
  console.log("port is" + port);
  this.db= new Db('oMapSequence', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

//SequenceProvider gives sequenced id's to Node, which otherwise doesn't have them
SequenceProvider.prototype.getSCollection = function(collectionName, callback) {
	this.getCollection(collectionName, callback);
};


SequenceProvider.prototype.getCollection = function(collectionName, callback) {
	this.db.collection(collectionName, function(error, collection) {
		if ( error ) {			console.log("failed to find collection" + collectionName + " errormsg:"+ error );		
			callback( error );
			return;
		} 
		callback(null, collection);
	});
};

SequenceProvider.prototype.getNextS = function(name, collectionName, callback) {
	this.getSCollection(collectionName, function(error, userColl) {
		// should checkout findAndModify
		userColl.findAndModify(
			{_id: name},
			[['_id', 'asc']],
			{'$inc': {"seq":1}},
			{new: true, upsert:true},
			function(error, data) {
				if ( error ) {
					console.error( error );
					return;
				}
				callback(null, data);
			}
		);
	});
};

SequenceProvider.prototype.counter = function(name, collectionName, callback) {
	this.getNextS(name, collectionName,
		function(error, seqObj) {
			if ( error ) {
				console.log( error );
				callback( error );
				return;
			} 
			callback(null, seqObj.seq);	
	});
};

SequenceProvider.prototype.base36Counter = function(name, collectionName, callback) {
	this.getNextS(name, collectionName,
		function(error, seqObj) {
			if ( error ) {
				console.log( error );
				callback( error );
				return;
			} 
			callback(null, seqObj.seq.toString(36));	
	});
};

SequenceProvider.instance = null; 

SequenceProvider.getInstance = function() {
	console.log("singleton"); 
	if (this.instance == null) return this.instance = new SequenceProvider(process.env.SEQUENCE_PROVIDER_HOST || '127.0.0.1', process.env.SEQUENCE_PROVIDER_PORT || 27017);
	else return this.instance;
};

//Singleton
exports.SequenceProvider = SequenceProvider.getInstance();