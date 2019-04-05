var configSpotify = require('./config-spotify');

//Moment Setup
var moment = require('moment');

//Axios for Spotify Web API calls
const axios = require('axios');

//Function to refresh auth token if necessary
//If Refresh Necessary, Function needs to:
// - Refresh using spoitfyApi
// - Update user ion database
const checkRefresh = (user, db, spotifyApi, next) => {
  //If current time is the same time or after the time user's auth token was set to expire
  //Then we must refresh the auth token
  if (moment().isSameOrAfter(user['spotifyAuthTokens']['expires'])){
    //Call Spotify API to Refresh Token
    spotifyApi.setRefreshToken(user['spotifyAuthTokens']['refresh'])
    spotifyApi.refreshAccessToken().then((data) => {
      var timeTokenExpires = moment().add(data.body['expires_in'],'s').format();
      //console.log(timeTokenExpires);
      spotifyAuthTokens = {
        'access': data.body['access_token'],
        'refresh': data.body['refresh_token'],
        'expires': timeTokenExpires
      }
      const users = db.collection('users');
      users.updateOne({'username': user['username']},
      {$set : {'spotifyAuthTokens': spotifyAuthTokens, 'spotifyAuth': true} },
      {}, (err, results) => {
        if(err) {
          next(err, user)
        }
        users.find({'username': user['username']}, {'projection': {'password': 0}}).toArray( (err, results) => {
          if(err) {
            next(err, user)
          }
          user = results[0]
          next(null,user)
        });
      });
    },
    (err) => {
      console.log(err)
      next(err,user)
    })
  }
  //Else, token is still valid and we can just call back
  else {
    next(null, user)
  }
}

const getAvgFeats = (user, db, songs, next) => {
  let data = {
    songs: [],
    avgFeatures: {
      popularity: 0,
      key : 0,
      mode : 0,
      time_signature : 0,
      acousticness : 0,
      danceability : 0,
      energy : 0,
      instrumentalness : 0,
      liveness : 0,
      loudness : 0,
      speechiness : 0,
      valence : 0,
      tempo : 0,
      duration_ms: 0,
      time_signature: 0
    }
  }
  let features = ["danceability","energy","key","loudness","mode","speechiness",
  "acousticness","instrumentalness","liveness",
  "valence","tempo","duration_ms","time_signature"];
  var idQueries = "";
  for (let song of songs['items']){
    //console.log(song)
    delete song["album"]["available_markets"];
    delete song["available_markets"];
    delete song["disc_number"];
    delete song["external_ids"];
    delete song["is_local"];
    idQueries += `${song['id']},`;
    data['songs'].push(song);
    data['avgFeatures']['popularity'] += song['popularity'];
  }
  spotifyAccessToken = user['spotifyAuthTokens']['access'];
  axios.get(`https://api.spotify.com/v1/audio-features?ids=${idQueries}`,
  {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
  .then(results => {
    console.log(results);
    for (let song of results['data']['audio_features']){
      for (let feature of features){
        //console.log(`Current Feature: ${feature}`)
        //console.log(`Total ${feature} Value: ${data['avgFeatures'][feature]}`)
        //console.log(`Song ${feature} Value: ${song[feature]}`)
        data['avgFeatures'][feature] += song[feature]
      }
    }
    for (let feature of Object.keys(data['avgFeatures'])){
      console.log(feature)
      data['avgFeatures'][feature] /= data['songs'].length;
    }
    //To-Do: Add the DB
    next(null, data)
  })
  .catch(err => {
    next(err,data);
  })
}

module.exports = {checkRefresh, getAvgFeats};
