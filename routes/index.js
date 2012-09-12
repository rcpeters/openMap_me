
/*
 * GET home page.
 */
var mapProvider = require('../mapProvider').MapProvider;
 
exports.index = function(req, res){
	console.log(req.url);
	var mapId = "";
	if (req.url.length > 3) mapId = req.url.substring(3);
  
	if (mapId == undefined || mapId == '') {
		mapProvider.createMap(function (error, map) {
			res.redirect('/m/' + map.id);
		});
	} else {  
			mapProvider.getMap(mapId, function(error, map) {
			if (error) {
				mapProvider.createMap(function (error, newMap) {
					console.log("bad request sent to new map" + newMap.id);
					res.redirect('/m/' + newMap.id);
				});
			} else {
				mapProvider.getUsers(map.id, function (users) {
					console.log(users);
					res.render('index', { title: 'oMap.me', 'map': map, 'users': users});
				});
			}
		});
	}
};