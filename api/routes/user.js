var express = require('express');
var router = express.Router();

var SpotifyWebApi = require('spotify-web-api-node');
var scopes = ['user-read-private', 'user-read-email', 'user-read-birthdate', 'user-top-read', 'user-library-read',
'playlist-modify-private', 'playlist-read-private', 'playlist-modify-public','user-read-recently-played'],
  state = 'spotification-state';
var configSpotify = require('./config-spotify');
var spotifyApi = new SpotifyWebApi(configSpotify);
var verify = require('../utils/verify');


const jwt = require('jsonwebtoken');
var jwtSecret = require('./config-jwt');
var middlewares = require('./middlewares');

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

const findDocuments = function(db, collectionName, filter, options, callback) {
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Find some documents
  collection.find(filter, options).toArray(function(err, docs) {
    console.log("Found the following records");
    console.log(docs);
    callback(err, docs);
  });
};

const insertDocument = function(db, collectionName, doc, options, callback ){
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Find some documents
  collection.insertOne(doc, options, (err, results) => {
    console.log("Inserted the following document");
    console.log(results);
    callback(err, results);
  });
};


/* POST user/ - Creates new User
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - username: username of new user (must be unique/not exist already in database)
    - password: password of new user (will be hashed upon reciept)
    - fullName: fullname of new user
*/
//TODO:
// - Hash Password
// - Add rest of user data into user documents
router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  findDocuments(db, 'users', {'username': username}, {}, (err, results) => {
    if ( results.length == 0  || !(results) ) {
      let {salt, passHash} = verify.saltHashPassword(password);
      let userDoc = {
        'username': username,
        'password': passHash,
        'salt': salt,
        'fullName': req.body.fullName,
        'spotifyAuthUrl': spotifyApi.createAuthorizeURL(scopes, state),
        'spotifyAuth': false
      }
      insertDocument(db, 'users', userDoc, {}, (err, results) => {
        if(err) {
          console.log(err);
          res.json(err);
        } else {
          jwt.sign({'username': username}, jwtSecret , { expiresIn: '1d' }, (err, token) => {
            if(err) {
              console.log(err);
              res.json(err);
            }
            user = results['ops'][0];
            delete user.password;
            delete user.salt;
            res.json({
              'token': token,
              'user': user
            });
          });
        }
      })
    }
    else {
      res.send('User Already Exists');
    }
  })
});

/* GET user/ - Gets Logged-In User
EXPECTS:
  HEADERS:
    - 'Authroization': 'Bearer <token>'
*/
router.get('/', middlewares.checkToken, (req, res) => {
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      //If error send Forbidden (403)
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(403);
    } else {
      //If token is successfully verified, we can send the autorized data
      findDocuments(db, 'users', {'username': authorizedData['username']}, {'projection': {'password': 0}}, (err, results) => {
        if(err) {
          console.log(err);
          res.json(err);
        }
        res.json(results);
      })
      //res.json({ authorizedData });
    }
  });
});

/* POST user/login/ - Log-In to Existing User
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - username: username of new user (must be exist already in database)
    - password: password of new user (will be hashed upon reciept/match with given user)
*/
router.post('/login', function(req, res, next) {
  var username = req.body.username;
  console.log(username);
  var password = req.body.password;
  console.log(password);
  findDocuments(db, 'users', {'username': username}, {}, (err, results) => {
    jwt.sign({'username': username}, jwtSecret, { expiresIn: '1d' }, (err, token) => {
      if(err) { console.log(err) }
      console.log('what up bitch');
      var hashedPass = results[0]['password'];
      var salt = results[0]['salt'];
      if (!verify.verifyPass(password, salt, hashedPass)){
        res.send("Password incorrect");
        return;
      }
      user = results[0];
      delete user.password;
      delete user.salt;
      res.json({
        'token': token,
        'user': results[0]
      });
    });
  })
});

/* POST user/spotifyauth/ - get access tokens from spotify web api after auth
EXPECTS:
  HEADERS:
    - 'Authroization': 'Bearer <token>'
  BODY:
    - 'code': code returned from spotify auth process
*/
router.post('/spotifyauth', middlewares.checkToken, (req, res) => {
  var code = req.query.code;
  if (req.body.code) code = req.body.code;
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      //If error send Forbidden (403)
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(403);
    } else {
      spotifyApi.authorizationCodeGrant(code).then((data) => {
        spotifyAuthTokens = {
          'access': data.body['access_token'],
          'refresh': data.body['refresh_token'],
          'expires': data.body['expires_in']
        }
        const users = db.collection('users');
        users.updateOne({'username': authorizedData['username']},
        {$set : {'spotifyAuthTokens': spotifyAuthTokens, 'spotifyAuth': true} },
        {}, (err, results) => {
          if(err) {
            console.log(err);
            res.json(err);
          }
          findDocuments(db, 'users', {'username': authorizedData['username']}, {'projection': {'password': 0}}, (err, results) => {
            if(err) {
              console.log(err);
              res.json(err);
            }
            res.json(results);
          })
        });
      })
      .catch( (err) => {
        console.log(err);
        res.json(err);
      })
    }
  })
});

module.exports = router;
