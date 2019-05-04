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
 */
const insertIntoCache = (queryType, user, reqBody, resObj) => {
  const queryCache = db.collection('queries');
   if (queryType === 'Recommendation'){
     if (reqBody.seedTracks){
       axios.get(`https://api.spotify.com/v1/tracks?ids=${reqBody.seedTracks}`,
       {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
       .then(results => {
         songs = songParser(results);
         reqBody['tracks'] = songs;
         if (reqBody.seedArtists){
           axios.get(`https://api.spotify.com/v1/artists?ids=${reqBody.seedArtists}`,
           {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
           .then(results => {
             //console.log(results)
             reqBody['artists'] = results.data.artists;
             queryCache.insert({
               'queryType': queryType,
               'timeOfQuery': moment().format(),
               'username': user['username'],
               'reqBody': reqBody,
               'resObj': resObj
             });
           })
           .catch(err => {
             console.log(err);
           })
         }
         else{
           queryCache.insert({
             'queryType': queryType,
             'timeOfQuery': moment().format(),
             'username': user['username'],
             'reqBody': reqBody,
             'resObj': resObj
           });
         }
       })
       .catch(err => {
         console.log(err);
       })
     }
     else if (reqBody.seedArtists){
       axios.get(`https://api.spotify.com/v1/artists?ids=${reqBody.seedArtists}`,
       {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
       .then(results => {
         reqBody['artists'] = results.data.artists;
         queryCache.insert({
           'queryType': queryType,
           'timeOfQuery': moment().format(),
           'username': user['username'],
           'reqBody': reqBody,
           'resObj': resObj
         });
       })
       .catch(err => {
         console.log(err);
       })
     }
  }
  else{
    queryCache.insert({
      'queryType': queryType,
      'timeOfQuery': moment().format(),
      'username': user['username'],
      'reqBody': reqBody,
      'resObj': resObj
    });
  }
}

/**
 * Stores a given query in the query cache
 * @function
 */
const insertSongFeatsIntoCache = (results) => {
  const songFeats = db.collection('song_feats');
  // actual data in results['data']
  // store audio features too
  // solution will be to hit the cache and add back the results when done
  for (let i = 0; i < results.length; i++){
    songFeats.insertOne(results[i]);
  }
}

/**
 * Does a preemptive search for existing songs
 * @function
 */
const songSearchByIds = (ids, callback) => {
  const songFeats = db.collection('song_feats');
  var id_arr = ids.map(x => {return {'id': x}});
  //console.log(id_arr)
  songFeats.find({
    '$or': id_arr
  }).toArray((err, results) => {
    if(err){
      console.log("oh no");
      callback({'results': []});
    } else {
      var used_ids = results.map(x => x['id']);
      console.log(used_ids)
      var new_ids = ids.filter(x => !used_ids.includes(x));
      console.log(new_ids)
      //console.log('results')
      //console.log(results)
      callback({ids: new_ids, results: results});
    }
  });
}

/**
 * Parses a Spotify API Call to return a list of songs
 * @function
 */
const songParser = (results) => {
  songs = [];
  for (let song of results.data.tracks) {
    song['album'] = {
      name: song['album']['name'],
      id: song['album']['id'],
      images: song['album']['images']
    }
    artists = []
    for (let artist of song['artists']) {
      artists.push({
        name: artist['name'],
        id: artist['id'],
        images: artist['images']
      })
    }
    song['artists'] = artists;
    delete song["available_markets"];
    delete song["disc_number"];
    delete song["external_ids"];
    delete song["is_local"];
    delete song["explicit"];
    delete song["track_number"];
    delete song["external_urls"];
    delete song["preview_url"];
    delete song["type"];
    delete song["href"];
    songs.push(song);
  }
  return songs;
}

module.exports = {getAllQueries, getQueriesForUser, insertIntoCache,
  songParser, insertSongFeatsIntoCache, songSearchByIds};
