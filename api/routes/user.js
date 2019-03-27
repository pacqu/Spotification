var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var scopes = ['user-read-private', 'user-read-email', 'user-read-birthdate', 'user-top-read', 'user-library-read',
'playlist-modify-private', 'playlist-read-private', 'playlist-modify-public','user-read-recently-played'],
  state = 'desplaycito-state';
var config-spotify = require('./config-spotify');

var spotifyApi = new SpotifyWebApi(config-spotify);

const jwt = require('jsonwebtoken');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const test = require('assert');
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'spotification';
// Create a new MongoClient
const client = new MongoClient(url);
let db;
client.connect(function(err) {
  console.log("Connected successfully to server");
  db = client.db(dbName);
});

const findDocuments = function(db, collectionName, filter, callback) {
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Find some documents
  collection.find(filter).toArray(function(err, docs) {
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
};

const insertDocument = function(db, collectionName, doc, callback ){
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Find some documents
  collection.insertOne(doc, (err, results) => {
    console.log("Found the following records");
    console.log(results);
    callback(results);
  });
};

/* Register User */
router.post('/', function(req, res, next) {
  var username = req.body.username;
  console.log(username);
  var password = req.body.password;
  console.log(password);
  findDocuments(db, 'users', {'username': username}, (results) => {
    if (!(results)) {
      insertDocument(db, 'users', {'username': username}, (results) => {
        res.send('User Just Created');
      })
    }
    else {
      res.send('User Already Exists');
    }
  })
});

module.exports = router;
