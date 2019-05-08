'use strict';

//MongoDB Setup
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Configurations
const url = process.env.PORT ? 'mongodb://heroku_gc3b483w:ns4reliqr5p6ae2ti3mv4bdihv@ds149806.mlab.com:49806/':'mongodb://localhost:27017';
const dbName = process.env.PORT ? 'heroku_gc3b483w':'spotification';

// Create a new MongoClient
const client = new MongoClient(url);

function connect(next){
    client.connect((err) => {
        if (err) {
            next(err, null);
        } else {
            console.log("Connected successfully to server");
            var db = client.db(dbName);
            next(null, db);
        }
    });
};

module.exports = {connect};