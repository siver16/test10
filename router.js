const express = require('express');
const router = express.Router();
const squel = require('squel');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : '185.86.79.240',
    user     : 'harduser',
    password : 'hardpassword',
    database : 'test10'
});

router.post('/', function(req, res) {
    if(req.body && req.body.name){
        if(req.body.name.length>1024 ){
            res.send({
                error:'Name length cannot be greater than 1024'
            });
        }else{
            let request = squel.select()
                .from('theme')
                .where(`name = '${req.body.name}'`)
                .toString();
            connection.query(request, function (error, results) {
                if (error){
                    res.send({
                        error: 'SQL error'
                    });
                }
                if(results.length>0){
                    res.send({
                        error: `name ${req.body.name} already exists`
                    });
                }else{
                    let request = squel.insert()
                        .into('theme')
                        .set('name', req.body.name)
                        .set('voteyes', 0)
                        .set('voteno', 0)
                        .toString();
                    connection.query(request, function (error, results) {
                        if (error){
                            res.send({
                                error: 'SQL error'
                            });
                        }
                        res.send({
                            error:null,
                            themeId: results.insertId
                        });
                    });
                }
            });
        }
    }else{
        res.send({
            error: 'wrong request'
        });
    }
});

router.get('/:themeId', function(req, res) {
    let request = squel.select()
        .from('theme')
        .where(`id = ${req.params.themeId}`)
        .toString();
    connection.query(request, function (error, results) {
        if (error){
            res.send({
                error: 'SQL error'
            });
        }
        if(results.length == 0){
            res.send({
                error: 'wrong id'
            });
        }else {
            res.send({
                name: results[0].name,
                votes:{
                    yes: results[0].voteyes,
                    no: results[0].voteno
                }
            });
        }
    });
});

router.post('/:themeId/yes', function(req, res) {
    let request = squel.update()
        .table('theme')
        .set('voteyes = voteyes + 1')
        .where(`id = ${req.params.themeId}`)
        .toString();
    connection.query(request, function (error) {
        if (error){
            res.send({
                error: 'SQL error'
            });
        }
        res.send('OK');
    });
});

router.post('/:themeId/no', function(req, res) {
    let request = squel.update()
        .table('theme')
        .set('voteno = voteno + 1')
        .where(`id = ${req.params.themeId}`)
        .toString();
    connection.query(request, function (error) {
        if (error){
            res.send({
                error: 'SQL error'
            });
        }
        res.send('OK');
    });
});

module.exports = router;