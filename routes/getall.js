var express = require('express');
var router = express.Router();
var fs = require('fs');
var json = {
	"johnson": {
		"serviceType": "shelter",
		"serviceContent": "",
		"location": []
	},
	"will": {
		"serviceType": "food",
		"serviceContent": "",
		"location": []
	},
	"blaine": {
		"serviceType": "clothing",
		"serviceContent": "",
		"location": []
	},
	"david": {
		"serviceType": "food",
		"serviceContent": "",
		"location": []
	},
}


/* GET all data */
router.get('/all', function(req, res, next) {
	//var obj = JSON.parse(fs.readFileSync('./donors.json', 'utf8'));
	res.send(json);
});

module.exports = router;
