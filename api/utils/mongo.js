'use strict';

//MongoDB Setup
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Configurations
const url = 'mongodb://localhost:27017';
const dbName = 'spotification';

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