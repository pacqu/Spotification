var express = require('express');
var router = express.Router();

//Back-End Utils
//Node Wrapper for Spotify Web API Setup
var SpotifyWebApi = require('spotify-web-api-node');
var scopes = ['user-read-private', 'user-read-email', 'user-read-birthdate', 'user-top-read', 'user-library-read',
'playlist-modify-private', 'playlist-read-private', 'playlist-modify-public','user-read-recently-played'],
  state = 'spotification-state';
var configSpotify = require('../configs/config-spotify');
var spotifyApi = new SpotifyWebApi(configSpotify);
var spotifyData = require('../utils/spotifyData');
var verify = require('../utils/verify');
var mongo = require('../utils/mongo');

//JWT Setup
const jwt = require('jsonwebtoken');
var jwtSecret = require('../configs/config-jwt');
var middlewares = require('../utils/middlewares');

//Axios for Spotify Web API calls
const axios = require('axios');

// Create a new MongoClient
let db;
mongo.connect((err,result) => {
  if (err) {
    console.log(err);
  } else {
    db = result;
  }
})

/* GET search/ - Get Spotify results from searching a particular string
EXPECTS:
  HEADERS:
    - 'Authorization': 'Bearer <token>'
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/', middlewares.checkToken, (req, res) => {
  //Validate Auth Token
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      console.log('ERROR: Could not connect to the protected route');
      res.status(401);
      res.send('Error with given token');
    } else {
      //Check if query string was given
      var searchString = req.query.search;
      if (!(searchString)){
        res.status(400);
        res.send('No query string given.');
        return;
      }
      //Grab User from DB to get spotify auth
      const users = db.collection('users');
      users.find({'username': authorizedData['username']}, {'projection': {'password': 0, 'salt': 0}}).toArray( (err, results) => {
        if(err) {
          console.log(err);
          res.json(err);
        }
        user = results[0];
        spotifyData.checkRefresh(user, db, spotifyApi, (err, checkedUser) => {
          if(err){
            console.log(err);
            res.status(500);
            res.json(err);
          }
          spotifyAccessToken = checkedUser['spotifyAuthTokens']['access'];
          //TO-DO: For now, will only return tracks; Will eventually also return artists, albums, playlists
          axios.get(`https://api.spotify.com/v1/search?q=${searchString}&type=track`,
          {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
          .then(results => {
            console.log(results.data)
            res.json(results.data)
          })
          .catch(err => {
            console.log(err);
            res.status(500);
            res.json(err);
          })
        })
      })
    }
  })
});

/* GET search/song - Get a list of songs in an app's cache
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/song', function(req, res, next){
  res.status(501);
  res.send('Route Not Implemented');
});

/* GET search/song - Get info for Spotify song given ID
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/song/:songId', function(req, res, next){
  var songId = req.params.songId;
  res.status(501);
  res.send('Route Not Implemented');
});

/* GET search/album - Get a list of albums in an app's cache
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/album', function(req, res, next){
  res.status(501);
  res.send('Route Not Implemented');
});

/* GET search/album - Get info for Spotify album given ID
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/album/:albumId', function(req, res, next){
  var albumId = req.params.albumId;
  res.status(501);
  res.send('Route Not Implemented');
});

/* GET search/artist - Get a list of artists in an app's cache
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/artist', function(req, res, next){
  res.status(501);
  res.send('Route Not Implemented');
});

/* GET search/artist - Get info for Spotify artist given ID
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/artist/:artistId', function(req, res, next){
  var artistId = req.params.artistId;
  res.status(501);
  res.send('Route Not Implemented');
});

/* GET search/playlist - Get a list of playlists in an app's cache
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/playlist', function(req, res, next){
  res.status(501);
  res.send('Route Not Implemented');
});

/* GET search/playlist - Get info for Spotify playlist given ID
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/playlist/:playlistId', function(req, res, next){
  var playlistId = req.params.playlistId;
  res.status(501);
  res.send('Route Not Implemented');
});

module.exports = router;
