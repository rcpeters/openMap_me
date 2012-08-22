
/*
 * GET home page.
 */
var mapProvider = require('../mapProvider').MapProvider;
 
exports.index = function(req, res){
  console.log(req.url);
  var mapId = "";
  if (req.url.length > 3) mapId = req.url.substring(3);
  else res.redirect('/m/' + Math.floor((Math.random()*10000)).toString(16));
  var users = mapProvider.usersByMapId(mapId, function(users) {
	res.render('index', { title: 'oMap.me', 'mapId': mapId, 'users': users});
  });
  
};