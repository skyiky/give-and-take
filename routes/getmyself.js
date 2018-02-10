var express = require('express');
var router = express.Router();
var fs = require('fs');
var json = {
	"johnson": {
		"0" : {
			"serviceType": "food",
			"serviceContent": "",
			"location": []
		}
	},
	"will": {
		"0" : {
			"serviceType": "food",
			"serviceContent": "",
			"location": []
		}
	},
	"blaine": {
		"0" : { 
			"serviceType": "food",
			"serviceContent": "",
			"location": []
		}
	},
	"david": {
		"0" : { 
			"serviceType": "food",
			"serviceContent": "",
			"location": []
		}
	},
}


/* GET all data */
router.get('/', function(req, res, next) {
	//var obj = JSON.parse(fs.readFileSync('./donors.json', 'utf8'));
	var id = "johnson" //req.body.username;
	var obj = json[id];
	res.send(obj);
});

module.exports = router;
