
/*
 * GET home page.
 */
var mapProvider = require('../mapProvider').MapProvider;
 
exports.index = function(req, res){
	console.log(req.url);
	var mapId = "";
	if (req.url.length > 3) mapId = req.url.substring(3);
  
	if (mapId == undefined || mapId == '') {
		mapProvider.createMap(function (map) {
			res.redirect('/m/' + map.id);
		});
	}
  
	var map = mapProvider.getMap(mapId, function(error, map) {
		if (error) {
			mapProvider.createMap(function (map) {
				res.redirect('/m/' + map.id);
				return false;
			});
		} else {
			mapProvider.getUsers(map.id, function (users) {
				console.log(users);
				res.render('index', { title: 'oMap.me', 'map': map, 'users': users});
			});
			
		}
	});
  
};