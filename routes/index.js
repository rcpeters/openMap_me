
/*
 * GET home page.
 */
var mapProvider = require('../project_modules/data_providers/mapProvider').MapProvider;
var cookieId = 'oMapV3';
 
exports.index = function(req, res){
	console.log(req.url);
	var mapId = "";
	if (req.url.length > 4) mapId = req.url.substring(5).toUpperCase();
	else if (req.cookies[cookieId]) {  
		var cookieJson =  JSON.parse(req.cookies[cookieId]);
		res.redirect('/map_' +  cookieJson.curMapId);
		return;
	}
	console.log("mapId mapId mapId mapId mapId mapId " + mapId);
	
	if (mapId == undefined || mapId == '') {
		mapProvider.createMap(function (error, map) {
			res.redirect('/map_' + map.id);
		});
	} else {  
			mapProvider.getMap(mapId, function(error, map) {
			if (error) {
				mapProvider.createMap(function (error, newMap) {
					console.log("bad request sent to new map" + newMap.id);
					res.redirect('/map_' + newMap.id);
				});
			} else {
				mapProvider.getUsers(map.id, function (users) {
					console.log(users);
					res.render('index', {});
				});
			}
		});
	}
};