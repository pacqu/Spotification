var express = require('express');
var router = express.Router();

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

//Query Utils
var queryUtils = require('../utils/queryUtils');

//JWT Setup
const jwt = require('jsonwebtoken');
var jwtSecret = require('../configs/config-jwt');
var middlewares = require('../utils/middlewares');

// Create a new MongoClient
let db;
mongo.connect((err,result) => {
  if (err) {
    console.log(err);
  } else {
    db = result;
  }
})

//Axios for Spotify Web API calls
const axios = require('axios');
/* GET queries/ - Return all queries across all users
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/', function(req, res, next){
  queryUtils.getAllQueries(res);
});

/* GET queries/user - Return all queries for a logged in user
EXPECTS:
  HEADERS:
    - 'Authorization': 'Bearer <token>'
*/
//TODO:
// - Test this route
router.get('/user', middlewares.checkToken, function(req, res, next){
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      console.log('ERROR: Could not connect to the protected route');
      res.status(401);
      res.send('Error with given token');
    } else {
      queryUtils.getQueriesForUser(res, authorizedData['username']);
    }
  });
});

/* GET queries/user/:username - Return all queries for given user
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/user/:username', function(req, res, next){
  var username = req.params.username;
  queryUtils.getQueriesForUser(res, username);
});

/* POST queries/recommend - Create new recommendation query
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.post('/recommend', function(req, res, next){
  res.status(501);
  res.send('Route Not Implemented');
});

/* POST queries/visual - Create new data visualization query
EXPECTS:
  HEADERS:
    - 'Authorization': 'Bearer <token>'
  BODY:
    - 'visualType' - type of data visualization queryUtils
     - Two Types:
       - 'top' - indicates want data for top spotify tracks
       - 'selected' - indicates want for given spotify tracks
    - 'selectedTracks' - If query is for selected Tracks
      - Should be an array of spotify track id's
*/
//TODO:
// - Return Data of Tracks - DONE
//   - If Data for Top Tracks:
//     - Get Song Info from Global Top 50 Playlist (id: 37i9dQZEVXbMDoHDwVN2tF) - DONE
//     - Process through getAvgFeats - DONE
//     - Return data object - DONE
//   - If Data for Given Tracks:
//     - Get Song Info of given tracks - DONE
//     - Process through getAvgFeats - DONE
//     - Return data object- DONE
// - Save & Query to DB - NOT DONE
router.post('/visual', middlewares.checkToken, (req, res) => {
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      //If error send Forbidden (403)
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(403);
    } else {
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
          if (req.body.visualType === "top"){
            axios.get('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks',
            {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
            .then(results => {
              let tracks = []
              for (let item of results['data']['items']){
                if (item.is_local) continue;
                tracks.push(item.track);
              }
              spotifyData.getAvgFeats(checkedUser, db, tracks, (err, data) => {
                if(err){
                  console.log(err);
                  res.status(500);
                  res.json(err);
                }
                res.json(data);
              })
            })
            .catch(err => {
              console.log(err);
              res.status(500);
              res.json(err);
              return;
            })
          }
          else if (req.body.visualType === "selected"){
            let trackIds = req.body.selectedTracks
            axios.get(`https://api.spotify.com/v1/tracks?ids=${trackIds.join(',')}`,
            {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
            .then(results => {
              console.log(results['data'])
              spotifyData.getAvgFeats(checkedUser, db, results['data']['tracks'], (err, data) => {
                if(err){
                  console.log(err);
                  res.status(500);
                  res.json(err);
                }
                res.json(data);
              })
            })
            .catch(err => {
              console.log(err);
              res.status(500);
              res.json(err);
              return;
            })
          }
          else{
            res.status(400);
            res.send('Invalid data visulization type queried for.');
            return;
          }
        })
      })
    }
  })
});

/* POST queries/collablist - Create new collablist query
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.post('/collablist', function(req, res, next){
  res.status(501);
  res.send('Route Not Implemented');
});

module.exports = router;
