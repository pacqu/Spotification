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
  let features = ["danceability","energy","key","loudness","mode","speechiness",
  "acousticness","instrumentalness","liveness",
  "valence","tempo","duration_ms","time_signature"];
  var idQueries = "";
  let genreArtists = [];
  let genres = {};
  for (let song of songs['items']){
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
    data['songs'].push(song);
    data['avgFeatures']['popularity'] += song['popularity'];
  }
  //console.log(albums)
  genreArtists = genreArtists.filter((el,i,a) => i === a.indexOf(el));
  spotifyAccessToken = user['spotifyAuthTokens']['access'];
  axios.get(`https://api.spotify.com/v1/audio-features?ids=${idQueries}`,
  {headers: { Authorization: `Bearer ${spotifyAccessToken}`}})
  .then(results => {
    for (let song of results['data']['audio_features']){
      for (let feature of features){
        data['avgFeatures'][feature] += song[feature]
      }
    }
    for (let feature of Object.keys(data['avgFeatures'])){
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
      data['sortedGenres'] = sortableGenres
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

module.exports = {checkRefresh, getAvgFeats};
