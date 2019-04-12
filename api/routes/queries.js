var express = require('express');
var router = express.Router();

//Query Utils
var queryUtils = require('../utils/queryUtils');

//JWT Setup
const jwt = require('jsonwebtoken');
var jwtSecret = require('../configs/config-jwt');
var middlewares = require('../utils/middlewares');

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
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.post('/visual', function(req, res, next){
  res.status(501);
  res.send('Route Not Implemented');
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
