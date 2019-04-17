import React from 'react'
import '../styles/Card.css';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

function Card({ user, queryType, userAvatar, trackImg, time, date, children, className }) {
  const cardStyles = classNames('Card', className);
  let result = trackImg.map((item =>{
    return(
      <img className="trackImg" src={item.album.images[1].url}/>
    )
  }))
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
          { queryType }
        </div>
      </div>
      <div className="CardBody">
        { result }
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
