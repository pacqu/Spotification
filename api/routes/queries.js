var express = require('express');
var router = express.Router();

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
    res.status(501);
    res.send('Route Not Implemented');
});

/* GET queries/user - Return all queries for a logged in user
EXPECTS:
  HEADERS:
    - N/A
  BODY:
    - N/A
*/
//TODO:
// - Implement this route
router.get('/user', function(req, res, next){
    res.status(501);
    res.send('Route Not Implemented');
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
    res.status(501);
    res.send('Route Not Implemented');
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
