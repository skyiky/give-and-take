var express = require('express');
var Guid = require('guid');
var fs = require('fs');
var router = express.Router();

router.post('/send', function(req, res) {
	try {
		var users = JSON.parse(fs.readFileSync('./routes/users.json', 'utf8'));
		var messages = JSON.parse(fs.readFileSync('./routes/messages.json', 'utf8'));
	} catch(e) {
    	// fail silently as no messages exist yet
    }

    var toUser = users[req.body.toUser];

    if (!toUser) {
    	return res.send({state: 'fail', error: 'User does not exist. Please re-enter the username.'});
    }

    var currentDate = new Date();

	var message = {
		id: Guid.create().value,
		toUser: req.body.toUser,
		fromUser: req.body.fromUser,
		timestamp: currentDate.toLocaleString(),
		subject: req.body.subject,
		content: req.body.content
	};

	if (!messages) {
		messages = {};
	}

	messages[message.id] = message;

	var content = JSON.stringify(messages)

    fs.writeFile("./routes/messages.json", content, 'utf8', function (err) {
        if (err) {
            return res.send({state: 'fail', error: 'An error occured, please try again.'});
        } else {
        	return res.send({state: 'success', message: message});
        }
    })
});

router.get('/:username', function(req, res) {
	try {
		var messages = JSON.parse(fs.readFileSync('./routes/messages.json', 'utf8'));
	} catch(e) {
    }

    var userMessages = [];
    var username = req.params.username;

    Object.keys(messages).forEach(function(key) {
    	var message = messages[key];

    	if (message.toUser.toLowerCase() === username.toLowerCase()) {
    		userMessages.push(message);
    	} else if (message.fromUser.toLowerCase() === username.toLowerCase()) {
    		message.subject = 'SENT: ' + message.subject;
    		userMessages.push(message);
    	}
    });

    return res.send({state:'success', messages: userMessages.reverse()});
})

module.exports = router;