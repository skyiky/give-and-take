var express = require('express');
var router = express.Router();

var users = {
	"vivan" : {
		"name": "Vivian Chung",
		"username": "bibz",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"johnson" : {
		"name": "Johnsun Sun",
		"username": "flyinpiggy",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"david" : {
		"name": "David Zhang",
		"username": "skyiky",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"blaine" : {
		"name": "Blaine Huynh",
		"username": "spiffykid",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"nessa": {
		"name": "Vanessa Harrison",
		"username": "Lunessa",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	}
};
// 

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


module.exports = router;
