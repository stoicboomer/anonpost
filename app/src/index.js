const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const validator = require('validator');
const anondb = require('./persistence/anondb.js');

var app = express();
app.use(express.static(path.join(__dirname, 'static/')));

app.get('/', (req, res) => {
    res.render('static/index.html')
});

//body-parser middleware to handle post requests
app.post('/send', bodyParser.urlencoded({ extended: true }));
app.post('/send', (req, res) => {
    if (req.body.message && req.body.message.trim().length > 0){
        anondb.addMessage(validator.escape(req.body.message), validator.escape(req.body.author))
        .then(() => {
            res.sendStatus(200);
        });
    }
    else 
        res.sendStatus(400);
});

app.get('/dump', (req, res) => {
    //TODO: regexp 'from' query to deny redundant requests to the database
    anondb.dumpMessages(req.query.from).then((messages) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(messages));
    });
});

anondb.init()
.then(() => {
    app.listen(3000, () => {
        console.log("Listening on port 3000.");
    });
})
.catch((error) => {
    console.log(error);
});
