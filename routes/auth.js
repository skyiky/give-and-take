var express = require('express');
var fs = require('fs');
var router = express.Router();

router.post('/signup', function(req, res, next) {
	try {
		var users = JSON.parse(fs.readFileSync('./routes/users.json', 'utf8'));
	} catch(e) {
    	// fail silently as no users exist yet
    }

    if (!users) {
    	users = {};
    }

    var user = users[req.body.username];

    if (user) {
    	return res.send({state: 'fail', error: 'User already exists, please try again.'})
    }

    users[req.body.username] = {
    	username : req.body.username,
    	email: req.body.email,
    	name: req.body.name,
    	gender: req.body.gender,
    	address: req.body.address,
    	city: req.body.city,
    	country: req.body.country,
    	postalCode: req.body.postalCode,
    	password: req.body.password
    };

    var content = JSON.stringify(users)

    fs.writeFile("./routes/users.json", content, 'utf8', function (err) {
        if (err) {
            return res.send({state: 'fail', error: 'An error occured, please try again.'});
        } else {
        	return res.send({state: 'success', user: users[req.body.username]});
        }
    })
});

/* POST login. */
router.post('/login', function(req, res, next) {
	try {
		var users = JSON.parse(fs.readFileSync('./routes/users.json', 'utf8'));
	} catch(e) {
		return res.send({state: 'fail'});
	}
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
	try {
		var users = JSON.parse(fs.readFileSync('./routes/users.json', 'utf8'));
	} catch(e) {
		return res.send({state: 'fail'});
	}
	//g

	return res.send({state: 'success', users: users});
});

router.get('/user/:username', function(req, res, next) {
	if (!req.params.username) {
		return res.send({state: 'fail'});
	}
	try {
		var users = JSON.parse(fs.readFileSync('./routes/users.json', 'utf8'));
	} catch(e) {
		return res.send({state: 'fail'});
	}
	//g


	var user = users[req.params.username];

	if (!user) {
		return res.send({state : "fail"});
	}

	return res.send({state: 'success', user: user});
});


module.exports = router;