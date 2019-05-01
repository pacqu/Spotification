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
  for (let song of songs){
    song['album'] = {
      name: song['album']['name'],
      id: song['album']['id'],
    }
    artists = []
    for (let artist of song['artists']){
      artists.push({
        name: artist['name'],
        id: artist['id'],
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
    idQueries += `${song['id']},`;
<<<<<<< HEAD
    data['songs'][song.id] = song;
=======
    data['songs'].push(song);
    idsArray.push(song['id']);
>>>>>>> adeed song caching, still have to actually make use of the cache
    data['avgFeatures']['popularity'] += song['popularity'];
  }
  //console.log(albums)
  genreArtists = genreArtists.filter((el,i,a) => i === a.indexOf(el));
  genreArtists = genreArtists.slice(0,50)
  //TO-DO: Query and Save to Cache
  spotifyAccessToken = user['spotifyAuthTokens']['access'];
  axios.get(`https://api.spotify.com/v1/audio-features?ids=${idQueries}`,
  {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
  .then(results => {
    queryUtils.insertSongFeatsIntoCache(idsArray, results['data']['audio_features']);
    for (let song of results['data']['audio_features']){
      data['songs'][song.id]['features'] = song;
      for (let feature of features){
        data['avgFeatures'][feature] += song[feature]
      }
    }
    for (let feature of features)){
      data['avgFeatures'][feature] /= data['songs'].length;
    }
    //TO-DO: Query and Save to Cache
    axios.get(`https://api.spotify.com/v1/artists?ids=${genreArtists.join(',')}`,
    {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
    .then(results => {
      for (let artist of results['data']['artists']){
        //console.log(artist)
        for (let genre of artist['genres']){
          //console.log(genre)
          if (genre in genres) genres[genre] += 1;
          else genres[genre] = 1;
        }
      }
      //console.log(genres);
      sortableGenres = Object.keys(genres).map(key => { return {genre: key, count: genres[key]} })
      //console.log(sortableGenres)
      sortableGenres = sortableGenres.sort((g1, g2) => g2.count - g1.count)
      data['sortedGenres'] = sortableGenres;
      //console.log(sortableGenres)
      next(null, data);
    })
    .catch(err => {
      next(err, data);
    })
  })
  .catch(err => {
    next(err,data);
  })
}

const getSimilairity = (data1, data2, next) => {
  if (!(data1 && data2)){
    next(-1);
    return;
  }
  delete data1.duration_ms;
  delete data2.duration_ms;
  data1.popularity /= 90;
  data2.popularity /= 90;
  data1.key /= 11;
  data2.key /= 11;
  data1.loudness /= -60;
  data2.loudness /= -60;
  data1.tempo /= 200;
  data2.tempo /= 200;
  data1.valence *= 2;
  data2.valence *= 2;
  data1.energy *= 2;
  data2.energy *= 2;
  data1.mode *= 2;
  data2.mode *= 2;
  data1.danceability *= 2;
  data2.danceability *= 2;
  let data1Vals = Object.values(data1);
  let data2Vals = Object.values(data2);
  let squareReducer = (accumulator, currentValue) => accumulator + Math.pow(currentValue,2);
  let sqrtd1 = Math.sqrt(data1Vals.reduce(squareReducer));
  let sqrtd2 = Math.sqrt(data2Vals.reduce(squareReducer));
  let denom = sqrtd1*sqrtd2;
  let num = 0;
  for (let i = 0; i < data1Vals.length; i++){
    num += data1Vals[i]*data2Vals[i];
  }
  console.log(100 - ((1 - num/denom) * 750))
  next(100 - ((1 - num/denom) * 750));
  return;
}

module.exports = {checkRefresh, getAvgFeats, getSimilairity};
