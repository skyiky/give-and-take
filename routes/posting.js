var express = require('express');
var router = express.Router();
var fs = require('fs');
var idCounter = fs.readFileSync('./routes/postIDCounter.txt', 'utf8');
idCounter = parseInt(idCounter);

router.delete('/delete', function(req, res) {
    var username = req.body.username;
    var postId = req.body.id
    var obj = JSON.parse(fs.readFileSync('./routes/donors.json', 'utf8'));
    if (obj[username][postId]) {
        delete obj[username][postId];
        var content = JSON.stringify(obj);
            fs.writeFile("./routes/donors.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })
    res.send({state: "success", data: obj});
    } else {
        res.send({state: "failed"});
    }
});

router.get('/all', function(req, res) {
    try {
        var obj = JSON.parse(fs.readFileSync('./routes/donors.json', 'utf8'));
    } catch(e) {
        return res.send({state: 'fail'});
    }

    return res.send({state: "success", data: obj});
});

router.get('/:username', function(req, res, next) {
    try {
        var obj = JSON.parse(fs.readFileSync('./routes/donors.json', 'utf8'));
    } catch(e) {
        return res.send({state: 'fail'});
    }
    var id = req.params.username;
    var userData = obj[id];
    if(userData == null) {
        return res.send({state: 'fail'});
    } else {
        res.send({state: "success", data: userData});
    }
});

router.post('/add', function(req, res) {
    try {
        var currentData = JSON.parse(fs.readFileSync('./routes/donors.json', 'utf8'));
    } catch(e) {
    }

    var donorData = {};
    var username = req.body.username;

    if (!req.body.serviceType || 
        !req.body.serviceContent || 
        !req.body.location ||
        !req.body.title || 
        req.body.serviceType.length < 1) {
        return res.send({state: 'fail'});
    } else {
        idCounter++;
        donorData.serviceType = req.body.serviceType;
        donorData.serviceContent = req.body.serviceContent;
        donorData.location = req.body.location;
        donorData.title = req.body.title;
        donorData.id = idCounter;
    }

    // if no data exists
    if (!currentData) {
        currentData = {};
    }
    if (!currentData.hasOwnProperty(username)) {
        currentData[username] = {};
    }

    currentData[username][idCounter] = donorData;

    var content = JSON.stringify(currentData);
    fs.writeFile("./routes/donors.json", content, 'utf8', function (err) {
        if (err) {
            return res.send({state: 'fail'});
        }
    })

    fs.writeFile("./routes/postIDCounter", idCounter, 'utf8', function (err) {
        if (err) {
            return res.send({state: 'fail'});
        }
    })

    return res.send({state: "success", id: idCounter});
});


router.post('/update', function(req, res) {
    try {
        var currentData = JSON.parse(fs.readFileSync('./routes/donors.json', 'utf8'));
    } catch(e) {
        return res.send({state: 'fail'});
    }
    

    var username = req.body.username;
    var postId = req.body.id;
    var donorData = {};

    if (currentData[username][postId]) {
        if (!req.body.serviceType || 
            !req.body.serviceContent || 
            !req.body.location ||
            !req.body.title ||
            req.body.serviceType.length < 1) {
            return res.send({state: 'fail'});
        } else {
            donorData.serviceType = req.body.serviceType;
            donorData.serviceContent = req.body.serviceContent;
            donorData.location = req.body.location;
            donorData.title = req.body.title;
        }
        currentData[username][postId] = donorData;
        var content = JSON.stringify(currentData);
    } else {
        return res.send({state: "fail"});
    }

    fs.writeFile("./routes/donors.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })

    return res.send({state: "success"});
});

module.exports = router;