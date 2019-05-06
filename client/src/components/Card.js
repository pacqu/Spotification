import React from 'react'
import '../styles/Card.css';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

function Card({ user, queryType, userAvatar, trackImg, time, date, artists, className, song}) {
  const cardStyles = classNames('Card', className);
  let images = trackImg.map((item =>{
    return(
      <img className="trackImg" src={item}/>
    )
  }))

  let allSongs = [], allArtists = [];
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

  let display;
  if (song.length > 0 && artists.length === 0){
    display = (
      <div className="query">
      {user + " looked Up " + song.length + " "}
      <div className="dropdown" >
        {song.length < 2 ? "song": "songs "}
          <div className="dropdown-content a">
              {allSongs}
          </div>
      </div>
      { queryType === 'Recommendation' ? " for Recommendations" : " for Visual Data" }
    </div>
    )
  }else if(song.length > 0 && artists.length > 0){
    display = (
      <div className="query">
        {user + " looked Up " + song.length + " "}
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
  }else{
    display = (
      <div className="query">
      {user + " looked Up " + artists.length + " "}
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

  return (
    <div className={cardStyles}>
      <div className="CardTop">
        <Link to={'/profile/'+ user}>
          <div className="user">
            <img className="userAvatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg"/>
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