//Moment Setup
var moment = require('moment');

//Axios for Spotify Web API calls
const axios = require('axios');
var queryUtils = require('./queryUtils')

//Function to refresh auth token if necessary
//If Refresh Necessary, Function needs to:
// - Refresh using spoitfyApi
// - Update user ion database
const checkRefresh = (user, db, spotifyApi, next) => {
  //If current time is the same time or after the time user's auth token was set to expire
  //Then we must refresh the auth token
  if (moment().isSameOrAfter(user['spotifyAuthTokens']['expires'])){
  //if (true){
    //Call Spotify API to Refresh Token
    spotifyApi.setRefreshToken(user['spotifyAuthTokens']['refresh'])
    spotifyApi.refreshAccessToken().then((data) => {
      var timeTokenExpires = moment().add(data.body['expires_in'],'s').format();
      console.log(timeTokenExpires);
      spotifyAuthTokens = {
        'access': data.body['access_token'],
        'refresh': user['spotifyAuthTokens']['refresh'],
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
      //console.log(err)
      next(err,user)
    })
  }
  //Else, token is still valid and we can just call back
  else {
    next(null, user)
  }
}
const forceRefresh = (user, db, spotifyApi, next) => {
  //If we need to foce a refresh for misc reasons
  //Call Spotify API to Refresh Token
  spotifyApi.setRefreshToken(user['spotifyAuthTokens']['refresh'])
  spotifyApi.refreshAccessToken().then((data) => {
    var timeTokenExpires = moment().add(data.body['expires_in'],'s').format();
    console.log(timeTokenExpires);
    spotifyAuthTokens = {
      'access': data.body['access_token'],
      'refresh': user['spotifyAuthTokens']['refresh'],
      'expires': timeTokenExpires
    }
    const users = db.collection('users');
    users.updateOne({'username': user['username']},
    {$set : {'spotifyAuthTokens': spotifyAuthTokens, 'spotifyAuth': true} },
    {}, (err, results) => {
      if(err) {
        next(err, user)
      }
      users.find({'username': user['username']}, {'projection': {'password': 0, 'salt':0 }}).toArray( (err, results) => {
        if(err) {
          next(err, user)
        }
        user = results[0]
        next(null,user)
      });
    });
  },
  (err) => {
    //console.log(err)
    next(err,user)
  })
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
  let features = Object.keys(data.avgFeatures);
  var idQueries = "";
  var idsArray = [];
  let genreArtists = [];
  let genres = {};
  let popularityObj = {};
  for (let song of songs){
    song['album'] = {
      name: song['album']['name'],
      id: song['album']['id'],
      images: song['album']['images']
    }
    artists = []
    //console.log(song)
    for (let artist of song['artists']){
      artists.push({
        name: artist['name'],
        id: artist['id'],
        images: artist['images']
      })
      genreArtists.push(artist['id']);
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
    data['songs'].push(song);
    idsArray.push(song['id']);
    popularityObj[song['id']] = song['popularity'];
  }
  queryUtils.songSearchByIds(idsArray, query_results => {
    idsArray = query_results['ids'];  // contains the ids that need to be searched
    //console.log('idsArray')
    //console.log(idsArray);
    var cache_results = query_results['results'];  // contains actual results
    //console.log('cache_results')
    //console.log(cache_results)
    for (let id of idsArray){
      idQueries += `${id},`;
    }
    genreArtists = genreArtists.filter((el,i,a) => i === a.indexOf(el));
    genreArtists = genreArtists.slice(0,50)
    //TO-DO: Query and Save to Cache
    spotifyAccessToken = user['spotifyAuthTokens']['access'];
    axios.get(`https://api.spotify.com/v1/audio-features?ids=${idQueries}`,
    {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
    .then(_results => {
      //console.log('feats')
      //console.log(_results);
      _results['data']['audio_features'] = _results['data']['audio_features'].filter(x => x !== null)
      console.log('null-filtered')
      //console.log(_results['data']['audio_features'])
      var results = [];
      if(_results['data']['audio_features'].length >= 1){
        for (let track of _results['data']['audio_features']){
          track['popularity'] = popularityObj[track.id];
        }
        results = _results['data']['audio_features'];
        queryUtils.insertSongFeatsIntoCache(results);
      }
      results = results.concat(cache_results);
      for (let song of results){
        for (let feature of features){
          data['avgFeatures'][feature] += song[feature]
        }
      }
      for (let feature of features){
        data['avgFeatures'][feature] /= data['songs'].length;
      }
      //TO-DO: Query and Save to Cache
      axios.get(`https://api.spotify.com/v1/artists?ids=${genreArtists.join(',')}`,
      {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
      .then(results => {
        for (let artist of results['data']['artists']){
          for (let genre of artist['genres']){
            if (genre in genres) genres[genre] += 1;
            else genres[genre] = 1;
          }
        }
        sortableGenres = Object.keys(genres).map(key => { return {genre: key, count: genres[key]} })
        sortableGenres = sortableGenres.sort((g1, g2) => g2.count - g1.count)
        data['sortedGenres'] = sortableGenres
        next(null, data);
      })
      .catch(err => {
        next(err, data);
      })
    })
    .catch(err => {
      console.log(err);
      next(err,data);
    })
  });
}

const getSimilairity = (data1, data2, next) => {
  if (!(data1 && data2)){
    next(-1);
    return;
  }
  delete data1.duration_ms;
  delete data2.duration_ms;

  let times10 = ['key', 'time_signature'];
  let times100 = ['mode','acousticness','danceability','energy','instrumentalness','liveness','speechiness','valence']
  for (let feat10 of times10){
    data1[feat10] = Math.floor(data1[feat10] * 10)
    data2[feat10] = Math.floor(data2[feat10] * 10)
  }
  for (let feat100 of times100){
    data1[feat100] = Math.floor(data1[feat100] * 100)
    data2[feat100] = Math.floor(data2[feat100] * 100)
  }
  data1.loudness = Math.floor(data1.loudness * -1.5);
  data2.loudness = Math.floor(data2.loudness * -1.5);
  data1.tempo = Math.floor(data1.tempo * .1);
  data2.tempo = Math.floor(data2.tempo * .1);
  let dataKeys = Object.keys(data1);
  let data1Vals = []//Object.values(data1);
  let data2Vals = []//Object.values(data2);
  for (let key of dataKeys){
    data1Vals.push(data1[key]);
    data2Vals.push(data2[key]);
  }
  //console.log(data1Vals.length)
  //console.log(data2Vals.length)
  console.log(data1Vals)
  console.log(data2Vals)
  let sqd1 = 0;
  let sqd2 = 0;
  for (let i = 0; i < data1Vals.length; i++){
    sqd1 += (data1Vals[i]*data1Vals[i]);
    //console.log(sqd1);
    sqd2 += (data2Vals[i]*data2Vals[i]);
    //console.log(sqd2);
  }
  //let squareReducer = (accumulator, currentValue) => accumulator + Math.pow(currentValue,2);
  let sqrtd1 = Math.sqrt(sqd1);
  let sqrtd2 = Math.sqrt(sqd2);
  let denom = Math.floor(sqrtd1*sqrtd2);
  let num = 0;
  for (let i = 0; i < data1Vals.length; i++){
    num += data1Vals[i]*data2Vals[i];
  }
  console.log(num)
  console.log(denom)
  console.log(num/denom)
  let result = num/denom;
  if (denom === 0 || num === 0) next(0);
  next(result*100);
  return;
}

module.exports = {checkRefresh, forceRefresh, getAvgFeats, getSimilairity};
