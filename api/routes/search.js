var express = require('express');
var router = express.Router();

/* GET search/ - Get Spotify results from searching a particular string
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/', function(req, res, next){
  var searchString = req.query.search;
  res.status(501);
  res.send('Route Not Implemented');
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
