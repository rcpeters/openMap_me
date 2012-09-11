
var MapProvider = function(){};

MapProvider.prototype.maps = new Array();
MapProvider.prototype.mapsById = new Array();

MapProvider.prototype.mapCount = 0;

MapProvider.prototype.getMap = function(mapId, callback) {
	callback(this.mapsById[mapId]);
};

MapProvider.prototype.createMap = function(callback) {
	var map = {
		id: '',
		users: [],
		objectVersion: '1',
	}
	var count = this.maps.push(map);
	var rand = Math.floor(Math.random() * 100);
	map.id = "m" + (count + rand).toString(16);
	this.mapsById[map.id] = map;
	callback(map);
};

MapProvider.prototype.containsMap = function(mapId) {
	if (this.mapsById[mapId] != null) return true;
	return false;
};

MapProvider.prototype.createUser = function(mapId, callback) {
	var user = {
		id : '',
		name: '',
		pos: '',
		lastUpdate: '',
		objectVersion: '1'
	};
	map = this.mapsById[mapId];
	var length = map.users.length;
	var uId = "U" + length + mapId;
	user.name = length; 
	user.id = uId;
	this.mapsById[mapId].users.push(user);
	console.log("create userrrrrrrrrrrrrrrrrr");
	console.log(user);
	callback(user);
};

MapProvider.prototype.updateUser = function(user, mapId, callback) {
	var map = this.mapsById[mapId];
	//map.users[user.id] = user;
	var users = map.users;
	console.log("before update");
	console.log(map);
    for (uX in users) {	
		if (users[uX].id == user.id) {
			users[uX] =  user;
				console.log("after update");
				console.log(map);

			callback(user);
		}
	}
};

MapProvider.instance = null; 

MapProvider.getInstance = function() {
	if (this.instance == null) return this.instance = new MapProvider()
	else return this.instance;
};

//Singleton
exports.MapProvider = MapProvider.getInstance();