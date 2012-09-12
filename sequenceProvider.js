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

SequenceProvider.prototype.getSCollection = function(callback) {
	this.getCollection('sequences', callback);
};

SequenceProvider.prototype.getCollection = function(collectionName, callback) {
	this.db.collection(collectionName, function(error, collection) {
		if ( error ) {
			console.log( error );		
			callback( error );
			return;
		} 
		callback(null, collection);
	});
};

SequenceProvider.prototype.getNextS = function(sequenceId, callback) {
	this.getSCollection(function(error, userColl) {
		// should checkout findAndModify
		userColl.findAndModify(
			{_id: sequenceId},
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

SequenceProvider.prototype.counter = function(name, callback) {
	this.getNextS(name,
		function(error, seqObj) {
			if ( error ) {
				console.log( error );
				callback( error );
				return;
			} 
			callback(null, seqObj.seq);	
	});
};

SequenceProvider.prototype.base36Counter = function(name, callback) {
	this.getNextS(name,
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
	if (this.instance == null) return this.instance = new SequenceProvider('127.0.0.1', 27017);
	else return this.instance;
};

//Singleton
exports.SequenceProvider = SequenceProvider.getInstance();