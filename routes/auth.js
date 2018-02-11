var express = require('express');
var router = express.Router();

var users = {
	"bibz" : {
		"name": "Vivian Chung",
		"username": "bibz",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"flyinpiggy" : {
		"name": "Johnsun Sun",
		"username": "flyinpiggy",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"skyiky" : {
		"name": "David Zhang",
		"username": "skyiky",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"spiffykid" : {
		"name": "Blaine Huynh",
		"username": "spiffykid",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"Lunessa": {
		"name": "Vanessa Harrison",
		"username": "Lunessa",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	}
};

/* POST login. */
router.post('/login', function(req, res, next) {
	//grab password if present
	var user = users[req.body.username];

	if (user == null) {
  		return res.send({state: "fail"});
  	}

  	if (user.password !== req.body.password) {
  	// return error since password doesn't match
  	return res.send({state: "fail"});
    }

    // return success + username 
    return res.send({state: 'success', user: user});
});

router.get('/users', function(req, res, next) {
	return res.send({state: 'success', users: users});
});

router.get('/user/:username', function(req, res, next) {
	if (!req.params.username) {
		return res.send({state: 'fail'});
	}

	var user = users[req.params.username];

	if (!user) {
		return res.send({state : "fail"});
	}

	return res.send({state: 'success', user: user});
});


module.exports = router;
