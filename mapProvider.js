
var MapProvider = function(){};


MapProvider.prototype.users = [];
MapProvider.prototype.activeMap = [];

MapProvider.prototype.usersByMapId = function(mapId, callback) {
	var users = this.users[mapId];
	callback(users);
};

MapProvider.prototype.saveUser = function(user, callback) {
	this.activeMap[user.id] = user.mapId; 
	users = this.users[user.mapId];
	if (users == undefined || users == null) users = this.users[user.mapId] = {};
	users[user.id] = user;
	callback(users);
};

MapProvider.prototype.removeActive = function(user, callback) {
	this.activeMap[user.id] = null;
	callback();
};

MapProvider.prototype.isActive = function(uuId, callback) {
	callback (!( this.activeMap[id] == undefined || this.activeMap[uuId] == null) );
};

MapProvider.instance = null; 

MapProvider.getInstance = function() {
	if (this.instance == null) return this.instance = new MapProvider()
	else return this.instance;
}

//Singleton
exports.MapProvider = MapProvider.getInstance();