const express = require('express')
    ,router = require('./router')
    ,bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use('/theme', router);
app.use(function (req, res) {
    let err = {
        status: 404,
        reason: 'unknown url'
    };
    res.send(err);
});

app.listen(5000);