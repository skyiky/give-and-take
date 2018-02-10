var express = require('express');
var router = express.Router();

var users = {
	"johnson" : {
		"username": "johnson",
		"password": "asdf",
		"email" : "zzhangddavid@gmail.com"
	},
	"david" : {
		"username": "david",
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
  		return res.send({state: "user does not exist", user: req.body.username});
  	}

  	if (user.password !== req.body.password) {
  	// return error since password doesn't match
  	return res.send({state: "password incorrect"});
    }

    // return success + username 
    return res.send({state: 'success', user: user});
});


module.exports = router;
