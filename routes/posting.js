var express = require('express');
var router = express.Router();
var fs = require('fs');
var idCounter = fs.readFileSync('./routes/postIDCounter.txt', 'utf8');
idCounter = parseInt(idCounter);

router.delete('/delete', function(req, res) {
    var user = req.body.username;
    var id = req.body.postId
    var obj = JSON.parse(fs.readFileSync('./routes/donors.json', 'utf8'));
    if (obj[user][id]) {
        delete obj[user][id];
    }   
    var content = JSON.stringify(obj);
    fs.writeFile("./routes/donors.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    })
    res.send({state: "success"}, obj);
});

router.get('/all', function(req, res) {
    try {
        var obj = JSON.parse(fs.readFileSync('./routes/donors.json', 'utf8'));
    } catch(e) {
        return res.send({state: 'fail'});
    }

    return res.send({state: "success"}, obj);
});

router.get('/:username', function(req, res, next) {
    var obj = JSON.parse(fs.readFileSync('./routers/donors.json', 'utf8'));
    var id = req.params.username;
    res.send({state: "success"}, obj[id]);
});

router.post('/add', function(req, res) {

    var currentData = JSON.parse(fs.readFileSync('./routes/donors.json', 'utf8'));
    var donorData = {};
    var username = req.body.username;
    
    donorData.serviceType = req.body.serviceType;
    donorData.serviceContent = req.body.serviceContent;
    donorData.location = req.body.location;
    donorData.name = req.body.name;

    idCounter++;

    console.log(currentData);

    currentData[username][idCounter] = donorData;
    

    var content = JSON.stringify(currentData);

    fs.writeFile("./routes/donors.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    })

    fs.writeFile("./routes/postIDCoutner", idCounter, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    })

    return res.send({state: "success"});
});


router.post('/update', function(req, res) {

    var currentData = fs.readFileSync('./routes/donors.json', 'utf8');
    
    currentData = JSON.parse(currentData);
    var username = req.body.username;
    var postID = req.body.ID;


    if (currentData[username]) {
        if (currentData[username][postID]){

            var donorData = {};
            donorData.serviceType = req.body.serviceType;
            donorData.serviceContent = req.body.serviceContent;
            donorData.location = req.body.location;
            donorData.name = req.body.name;

            currentData[username][postID] = donorData;
            var content = JSON.stringify(currentData);
        } else {
            return res.send({state: "failed"});
        }
    } else {
        return res.send({state: "failed"});
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