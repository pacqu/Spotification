import React from 'react'
import '../styles/MediaListItem.css';

const MediaListItem = ({ onClick, name, primaryContext, secondaryContext, coverArtUrl }) => {
  return (
    <div onClick={onClick} className="media-list-item">
      <div className="item-cover-art">
        <div className="item-cover-art-image" style={{"backgroundImage" : `url(${coverArtUrl})`}}></div>
        <div className='item-button'>
          <button className="item-play-button">
            <div className='icon-play'></div>
          </button>
        </div>
      </div>
      <div className="item-info">
        <div className="info-name">{name}</div>
        <div className="info-context">
          <p>{primaryContext}</p>
          { secondaryContext && <div className="context-secondary">{secondaryContext}</div> }
        </div>
      </div>
    </div>
  )
}

export default MediaListItem
