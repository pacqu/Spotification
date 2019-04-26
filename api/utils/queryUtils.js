//Moment Setup
const moment = require('moment');
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
 * Query Mock Data
 * {
 *   username: self-explanatory,
 *   type: recommendations, visualizations, collablists, listening_data
 *   data: ^^dependent on query type
 * }
 */

/**
 * Returns all queries in the database
 * @function
 * @param res - response object to use
 */
const getAllQueries = (res) => {
  const queries = db.collection('queries');
  queries.find({}).sort({timeOfQuery: -1}).toArray( (err, results) => {
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
  queries.find({'username': username}).sort({timeOfQuery: -1}).toArray( (err, results) => {
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

/**
 * Stores a given query in the query cache
 * @function
 * @param res - response object to use
 * @param {string} username - username in question
 */
const insertIntoCache = (queryType, username, reqBody, resObj) => {
  const queryCache = db.collection('queries');
  queryCache.insert({
    'queryType': queryType,
    'timeOfQuery': moment().format(),
    'username': username,
    'reqBody': reqBody,
    'resObj': resObj
  });
}

module.exports = {getAllQueries, getQueriesForUser, insertIntoCache};
