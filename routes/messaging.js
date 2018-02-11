var express = require('express');
var Guid = require('guid');
var fs = require('fs');
var router = express.Router();

router.post('/send', function(req, res) {
	try {
		var messages = JSON.parse(fs.readFileSync('./routes/messages.json', 'utf8'));
	} catch(e) {
    	// fail silently as no messages exist yet
    }

	var message = {
		id: Guid.create().value,
		toUser: req.body.toUser,
		fromUser: req.body.fromUser,
		timestamp: Date.now(),
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

module.exports = router;