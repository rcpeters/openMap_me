
/*
 * GET home page.
 */
var mapProvider = require('../mapProvider').MapProvider;
 
exports.index = function(req, res){
  console.log(req.url);
  var mapId = "";
  if (req.url.length > 3) mapId = req.url.substring(3);
  
  console.log(mapProvider.containsMap(mapId));
  if (!mapProvider.containsMap(mapId)) {
	mapProvider.createMap(function (map) {
		res.redirect('/m/' + map.id)
	});
  }
  
  var map = mapProvider.getMap(mapId, function(map) {
	console.log(map);
	res.render('index', { title: 'oMap.me', 'map': map});
  });
  
};