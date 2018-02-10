var express = require('express');
var router = express.Router();
var fs = require('fs');
var json = {
	"johnson": {
		"0" : {
			"serviceType": "food",
			"serviceContent": "",
			"location": []
		},
		"1" : {
			"serviceType": "shelter",
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
router.delete('/', function(req, res) {
	//var obj = JSON.parse(fs.readFileSync('./donors.json', 'utf8'));
	var user = "johnson" //req.body.username;
	var id = "0" //req.body.postId
	var obj = json[user][id];
	res.send(obj);
	delete obj;
});

module.exports = router;
