var express = require('express');
var router = express.Router();

var SpotifyWebApi = require('spotify-web-api-node');
var scopes = ['user-read-private', 'user-read-email', 'user-read-birthdate', 'user-top-read', 'user-library-read',
'playlist-modify-private', 'playlist-read-private', 'playlist-modify-public','user-read-recently-played'],
  state = 'spotification-state';
var configSpotify = require('./config-spotify');
var spotifyApi = new SpotifyWebApi(configSpotify);


const jwt = require('jsonwebtoken');
var jwtFunctions = require('./jwt');
var jwtSecret = require('./config-jwt');

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
  //Uncomment if you want to drop user client
  db.collection('users').drop();
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
    console.log("Inserted the following document");
    console.log(results);
    callback(results);
  });
};


/* Register User */
//TODO:
// - Hash Password
// - Add rest of user data into user documents
// -- Generate spotify url for auth
router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  findDocuments(db, 'users', {'username': username}, (results) => {
    if ( results.length == 0  || !(results) ) {
      let userDoc = {
        'username': username,
        'password': password,
        'full_name': req.body.fullName,
        'spotify_auth_url': spotifyApi.createAuthorizeURL(scopes, state)
      }
      insertDocument(db, 'users', userDoc, (results) => {
        jwt.sign({'username': username}, jwtSecret , { expiresIn: '1d' },(err, token) => {
          if(err) { console.log(err) }
          res.send(token);
        });
      })
    }
    else {
      res.send('User Already Exists');
    }
  })
});


/* Login User */
//TODO:
router.post('/login', function(req, res, next) {
  var username = req.body.username;
  //console.log(username);
  var password = req.body.password;
  //console.log(password);
  findDocuments(db, 'users', {'username': username, 'password': password}, (results) => {
    if ( results.length == 0  || !(results) ) {
      res.send("User doesn't Exists");
    }
    else {
      jwt.sign({'username': username}, jwtSecret , { expiresIn: '1d' },(err, token) => {
        if(err) { console.log(err) }
        res.send(token);
      });
    }
  })
});

module.exports = router;
