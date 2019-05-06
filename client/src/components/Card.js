import React from 'react'
import '../styles/Card.css';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

function Card({ user, queryType, userAvatar, trackImg, time, date, children, className, song}) {
  const cardStyles = classNames('Card', className);
  let images = trackImg.map((item =>{
    return(
      <img className="trackImg" src={item.album.images[1].url}/>
    )
  }))
  let allSongs = song.map((item =>{
    return(
      <h4>{item.name + " - " + item.artists[0].name}</h4>
    )
  }))
  console.log(song)
  return (
    <div className={cardStyles}>
      <div className="CardTop">
        <Link to={'/profile/'+ user}>
          <div className="user">
            <img className="userAvatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg"/>
            { user }
          </div>
        </Link>
        <div className="query">
          {user + " Looked Up " + allSongs.length}{allSongs.length === 1 ? " song for " : " songs for "}
          <div className="dropdown" >
            { queryType === 'Recommendation' ? 'Recommendations' : "Visual Data" }
              <div className="dropdown-content a">
                  {allSongs}
              </div>
          </div>
        </div>
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