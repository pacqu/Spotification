import React from 'react'
import '../styles/Card.css';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

function Card({ user, queryType, userAvatar, trackImg, time, date, artists, genre, className, song}) {
  const cardStyles = classNames('Card', className);
  let images = trackImg.map((item =>{
    return(
      <img className="trackImg" src={item}/>
    )
  }))

  let allSongs = [], allArtists = [], allGenres = [];
  if(song.length > 0){
    allSongs = song.map((item =>{
      return(
        <h4>{item}</h4>
      )
    }))
  }
  if(artists.length > 0){
    allArtists = artists.map((item =>{
      return(
        <h4>{item}</h4>
      )
    }))
  }
  if(genre.length > 0){
    allGenres = genre.map((item =>{
      return(
        <h4>{item}</h4>
      )
    }))
  }
  let avatar = "https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg";
  if (userAvatar) avatar = userAvatar;

// todo: hard coded ty
// song + artist + genre
// song + genre (check)
// song + artist (check)
// artist + genre (check)
// song (check)
// artist (check)
// genre (check)
  let display;
  if (song.length === 50 && artists.length === 0 && genre.length === 0){ //songs
    display = (
      <div className="query">
        {user + " Looked up "}
        <div className="dropdown" >
          {"Spotify Top 50"}
            <div className="dropdown-content a">
                {allSongs}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }else if (song.length > 0 && artists.length === 0 && genre.length === 0){ //songs
    display = (
      <div className="query">
        {user + " Looked up " + song.length + " "}
        <div className="dropdown" >
          {song.length < 2 ? "song": "songs "}
            <div className="dropdown-content a">
                {allSongs}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }else if(song.length > 0 && artists.length > 0 && genre.length === 0){  // songs | artists
    display = (
      <div className="query">
        {user + " Looked up " + song.length + " "}
        <div className="dropdown" >
          {song.length < 2 ? "song": "songs "}
            <div className="dropdown-content a">
                {allSongs}
            </div>
        </div>
        {" and " + artists.length + " "}
        <div className="dropdown" >
          {artists.length < 2 ? "artist": "artists "}
            <div className="dropdown-content a">
              {allArtists}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }else if(song.length === 0 && artists.length > 0 && genre.length === 0){ // artists
    display = (
      <div className="query">
        {user + " Looked up " + artists.length + " "}
        <div className="dropdown" >
          {artists.length < 2 ? "artist": "artists "}
            <div className="dropdown-content a">
                {allArtists}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }
  else if(song.length === 0 && artists.length === 0 && genre.length > 0){ // genres
    display = (
      <div className="query">
        {user + " Looked up " + genre.length + " "}
        <div className="dropdown" >
          {genre.length < 2 ? "genre": "genres "}
            <div className="dropdown-content a">
                {allGenres}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }else if(song.length === 0 && artists.length > 0 && genre.length > 0){  //artists || genre
    display = (
      <div className="query">
        {user + " Looked up " + artists.length + " "}
        <div className="dropdown" >
          {artists.length < 2 ? "artist": "artists "}
            <div className="dropdown-content a">
                {allArtists}
            </div>
        </div>
        {" and " + genre.length + " "}
        <div className="dropdown" >
          {genre.length < 2 ? "genre": "genres "}
            <div className="dropdown-content a">
                {allGenres}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }else if(song.length > 0 && artists.length === 0 && genre.length > 0){  // songs | genre
    display = (
      <div className="query">
        {user + " Looked up " + song.length + " "}
        <div className="dropdown" >
          {song.length < 2 ? "song": "songs "}
            <div className="dropdown-content a">
                {allSongs}
            </div>
        </div>
        {" and " + genre.length + " "}
        <div className="dropdown" >
          {genre.length < 2 ? "genre": "genres "}
            <div className="dropdown-content a">
                {allGenres}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }else if(song.length > 0 && artists.length > 0 && genre.length > 0){  // songs | artists | genre
    display = (
      <div className="query">
        {user + " Looked up " + song.length + " "}
        <div className="dropdown" >
          {song.length < 2 ? "song": "songs "}
            <div className="dropdown-content a">
                {allSongs}
            </div>
        </div>
        {" and " + artists.length + " "}
        <div className="dropdown" >
          {artists.length < 2 ? "artist": "artists "}
            <div className="dropdown-content a">
              {allArtists}
            </div>
        </div>
        {" and " + genre.length + " "}
        <div className="dropdown" >
          {genre.length < 2 ? "genre": "genres "}
            <div className="dropdown-content a">
                {allGenres}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }else if (song.length === 50 && artists.length === 0 && genre.length === 0){ //songs
    display = (
      <div className="query">
        {user + " Looked up spotify" + song.length + " "}
        <div className="dropdown" >
          {song.length < 2 ? "song": "songs "}
            <div className="dropdown-content a">
                {allSongs}
            </div>
        </div>
        { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
      </div>
    )
  }

  return (
    <div className={cardStyles}>
      <div className="CardTop">
        <Link to={'/profile/'+ user}>
          <div className="user">
            <img className="userAvatar" src={avatar}/>
            { user }
          </div>
        </Link>
      {display}
      </div>
      <div className="CardBody">
        { images }
      </div>
      <div className="CardBottom">
        <div className="left">
          { time }
        </div>
        <div className="right">
          { date }
        </div>
      </div>
    </div>
  )
}

export default Card
