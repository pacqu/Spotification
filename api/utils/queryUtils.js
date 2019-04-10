//Moment Setup
var moment = require('moment');
//Axios for Spotify Web API calls
const axios = require('axios');
//MongoDB Connection
var mongo = require('../utils/mongo');
let db;
mongo.connect((err,result) => {
  if (err) {
    console.log(err);
  } else {
    db = result;
  }
})

/**
 * Returns all queries in the database
 * @function
 * @param res - response object to use
 */
const getAllQueries = (res) => {
  const queries = db.collection('queries');
  queries.find({}).toArray( (err, results) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.json(err);
    } else if ( results.length == 0  || !(results) ) {
      res.status(404);
      res.send("No results found. Contact the developers.");
    } else { 
      console.log(results);
      res.json(results);
    }
  });
}

/**
 * Returns all queries of a given user from a database
 * @function
 * @param res - response object to use
 * @param {string} username - username in question
 */
const getQueriesForUser = (res, username) => {
  const queries = db.collection('queries');
  queries.find({'username': username}).toArray( (err, results) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.json(err);
    } else if ( results.length == 0  || !(results) ) {
      res.status(404);
      res.send("Given user does not exist/Does not have any queries");
    } else { 
      console.log(results);
      res.json(results);
    }
  });
}

module.exports = {getAllQueries, getQueriesForUser};
