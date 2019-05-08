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
      var limit = req.query.limit;
      if (!(searchString)){
        res.status(400);
        res.send('No query string given.');
        return;
      }
      var searchType = "track";
      if (req.query.searchType) searchType = req.query.searchType;
      //Grab User from DB to get spotify auth
      const users = db.collection('users');
      users.find({'username': authorizedData['username']}, {'projection': {'password': 0, 'salt': 0}}).toArray( (err, results) => {
        if(err) {
          console.log(err);
          res.status(500);
          res.json(err);
          return;
        }
        user = results[0];
        spotifyData.checkRefresh(user, db, spotifyApi, (err, checkedUser) => {
          if(err){
            console.log(err.data);
            res.status(500);
            res.json(err.data);
            return;
          }
          spotifyAccessToken = checkedUser['spotifyAuthTokens']['access'];
          axios.get(`https://api.spotify.com/v1/search?q=${searchString}&type=${searchType}${limit ? '&limit='+limit : ''}`,
          {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
          .then(results => {
            console.log(results.data)
            res.json(results.data)
          })
          .catch(err => {
            console.log(err['response'].data);
            res.status(500);
            res.json(err['response'].data);
            return;
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
// - Save & Query to DB - NOT DONE
router.get('/album/:albumId', middlewares.checkToken, (req, res) => {
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      console.log('ERROR: Could not connect to the protected route');
      res.status(401);
      res.send('Error with given token');
    } else {
      //Check if query string was given
      var albumId = req.params.albumId;
      if (!(albumId)){
        res.status(400);
        res.send('No query playlist given.');
        return;
      }
      //Grab User from DB to get spotify auth
      const users = db.collection('users');
      users.find({'username': authorizedData['username']}, {'projection': {'password': 0, 'salt': 0}}).toArray( (err, results) => {
        if(err) {
          console.log(err);
          res.json(err);
          return;
        }
        user = results[0];
        spotifyData.checkRefresh(user, db, spotifyApi, (err, checkedUser) => {
          if(err){
            console.log(err);
            res.status(500);
            res.json(err);
            return;
          }
          spotifyAccessToken = checkedUser['spotifyAuthTokens']['access'];
          axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
          .then(results => {
            //console.log(results.data)
            res.json(results.data)
          })
          .catch(err => {
            console.log(err['response'].data);
            res.status(500);
            res.json(err['response'].data);
            return;
          })
        })
      })
    }
  })
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
// - Save & Query to DB - NOT DONE
router.get('/artist/:artistId', middlewares.checkToken, (req, res) => {
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      console.log('ERROR: Could not connect to the protected route');
      res.status(401);
      res.send('Error with given token');
    } else {
      //Check if query string was given
      var artistId = req.params.artistId;
      if (!(artistId)){
        res.status(400);
        res.send('No query artist given.');
        return;
      }
      //Grab User from DB to get spotify auth
      const users = db.collection('users');
      users.find({'username': authorizedData['username']}, {'projection': {'password': 0, 'salt': 0}}).toArray( (err, results) => {
        if(err) {
          console.log(err);
          res.json(err);
          return;
        }
        user = results[0];
        spotifyData.checkRefresh(user, db, spotifyApi, (err, checkedUser) => {
          if(err){
            console.log(err);
            res.status(500);
            res.json(err);
            return;
          }
          spotifyAccessToken = checkedUser['spotifyAuthTokens']['access'];
          axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
          {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
          .then(results => {
            //console.log(results.data)
            res.json(results.data)
          })
          .catch(err => {
            console.log(err['response'].data);
            res.status(500);
            res.json(err['response'].data);
            return;
          })
        })
      })
    }
  })
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
// - Save & Query to DB - NOT DONE
router.get('/playlist/:playlistId', middlewares.checkToken, (req, res) => {
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      console.log('ERROR: Could not connect to the protected route');
      res.status(401);
      res.send('Error with given token');
    } else {
      //Check if query string was given
      var playlistId = req.params.playlistId;
      if (!(playlistId)){
        res.status(400);
        res.send('No query playlist given.');
        return;
      }
      //Grab User from DB to get spotify auth
      const users = db.collection('users');
      users.find({'username': authorizedData['username']}, {'projection': {'password': 0, 'salt': 0}}).toArray( (err, results) => {
        if(err) {
          console.log(err);
          res.json(err);
          return;
        }
        user = results[0];
        spotifyData.checkRefresh(user, db, spotifyApi, (err, checkedUser) => {
          if(err){
            console.log(err);
            res.status(500);
            res.json(err);
            return;
          }
          spotifyAccessToken = checkedUser['spotifyAuthTokens']['access'];
          axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
          .then(results => {
            console.log(results.data)
            res.json(results.data)
          })
          .catch(err => {
            console.log(err);
            res.status(500);
            res.json(err);
            return;
          })
        })
      })
    }
  })
});

/* GET search/similarity - Get similarity between user and given spotify entity
EXPECTS:
  HEADERS:
    - 'Authorization': 'Bearer <token>'
  BODY:
    - N/A
*/
router.get('/similarity', middlewares.checkToken, (req, res) => {
  //Validate Auth Token
  jwt.verify(req.token, jwtSecret, (err, authorizedData) => {
    if(err){
      console.log('ERROR: Could not connect to the protected route');
      res.status(401);
      res.send('Error with given token');
    } else {
      //Check if query string was given
      var idType = req.query.type;
      var id = req.query.id;
      if (!(idType && id)){
        res.status(400);
        res.send('Invalid spotify entity given.');
        return;
      }
      //Grab User from DB to get spotify auth
      const users = db.collection('users');
      users.find({'username': authorizedData['username']}, {'projection': {'password': 0, 'salt': 0}}).toArray( (err, results) => {
        if(err) {
          console.log(err);
          res.status(500);
          res.json(err);
          return;
        }
        user = results[0];
        spotifyData.checkRefresh(user, db, spotifyApi, (err, checkedUser) => {
          if(err){
            console.log(err.data);
            res.status(500);
            res.json(err.data);
            return;
          }
          spotifyAccessToken = checkedUser['spotifyAuthTokens']['access'];
          //song
          if (idType === 'track') {
            axios.get(`https://api.spotify.com/v1/tracks?ids=${id}`,
              {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
              .then(results => {
                //console.log(results['data']['tracks'])
                spotifyData.getAvgFeats(checkedUser, db, results['data']['tracks'], (err, data) => {
                  if(err){
                    console.log(err);
                    res.status(500);
                    res.json(err);
                    return;
                  }
                  console.log(data)
                  spotifyData.getSimilairity(data.avgFeatures, user.listeningData.avgFeatures, (data) => {
                    var similarity = null;
                    if (data !== -1) similarity = data;
                    res.json({score: data});
                  })
                })
              })
              .catch(err => {
                console.log(err['response'].data);
                res.status(500);
                res.json(err['response'].data);
                return;
              })
            }
          //artist
          if (idType === 'artist') {
            axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`,
              {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
              .then(results => {
                spotifyData.getAvgFeats(checkedUser, db, results['data']['tracks'], (err, data) => {
                  if(err){
                    console.log(err);
                    res.status(500);
                    res.json(err);
                    return;
                  }
                  spotifyData.getSimilairity(data.avgFeatures, user.listeningData.avgFeatures, (data) => {
                    var similarity = null;
                    if (data !== -1) similarity = data;
                    res.json({score: data});
                  })
                })
              })
              .catch(err => {
                console.log(err['response'].data);
                res.status(500);
                res.json(err['response'].data);
                return;
              })
            }
          //album
          if (idType === 'album') {
            axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`,
              {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
              .then(results => {
                let tracks = results['data']['items'];
                let trackIds = tracks.map(track => track.id);
                axios.get(`https://api.spotify.com/v1/tracks?ids=${trackIds.slice(0,50).join(',')}`,
                  {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
                  .then(results => {
                    spotifyData.getAvgFeats(checkedUser, db, results['data']['tracks'], (err, data) => {
                      if(err){
                        console.log(err);
                        res.status(500);
                        res.json(err);
                        return;
                      }
                      console.log(data)
                      spotifyData.getSimilairity(data.avgFeatures, user.listeningData.avgFeatures, (data) => {
                        var similarity = null;
                        if (data !== -1) similarity = data;
                        res.json({score: data});
                      })
                    })
                  })
              })
              .catch(err => {
                console.log(err);
                res.status(500);
                res.json(err['response']);
                return;
              })
            }
          //playlist
          if (idType === 'playlist') {
            axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks`,
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
                    return;
                  }
                  spotifyData.getSimilairity(data.avgFeatures, user.listeningData.avgFeatures, (data) => {
                    var similarity = null;
                    if (data !== -1) similarity = data;
                    res.json({score: data});
                  })
                })
              })
              .catch(err => {
                console.log(err);
                res.status(500);
                res.json(err['response']);
                return;
              })
            }
        })
      })
    }
  })
});

/* DELETE search/delete - Drops All Users
FOR DEVELOPMENT ONLY - COMMENT THIS OUT FOR PRODUCTION

router.get('/delete', (req, res) => {
  const songFeats = db.collection('song_feats');
  const featsDel = songFeats.drop((err, delOK) => {
    if (err) res.json(err);
    return;
    if (delOK) res.json({delted: delOK});
  })
});
*/
module.exports = router;
