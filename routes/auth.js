var express = require('express');
var router = express.Router();
var users = {};

/* POST login. */
router.post('/login', function(req, res, next) {
	//grab password if present
	var userPass = users[req.body.username];

	if (userPass == null) {
  		return res.send({state: "denied"});
  	}
  	if (userPass !== req.body.password) {
  	// return error since password doesn't match
  	return res.send({state: "denied"});
    }
  // return success + username 
  return res.send({state: 'success', username: req.body.username});
});

module.exports = router;
