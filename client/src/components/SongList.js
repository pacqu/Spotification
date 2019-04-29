import React from 'react'
import '../styles/SongList.css';

function msToMinutesAndSeconds(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export default function SongList({ songs, handleClick }) {
  const tracks = songs.map((song, i) => (
    <li onClick={() => handleClick(song)} className='user-song-item' key={ i }>
      <div className='play-song'>
        <i className='fa-play-circle-o' aria-hidden="true"/>
      </div>

      <p className='add-song'>
        <i className="fa fa-plus add-song" aria-hidden="true" />
      </p>

      <div className='song-title'>
        <p>{ song.name }</p>
      </div>

      <div className='song-artist'>
        <p>{ song.artists[0].name }</p>
      </div>

      <div className='song-album'>
        <p>{ song.album.name }</p>
      </div>

      <div className='song-added'>
        <p> 2069-04-20 </p>
      </div>

      <div className='song-length'>
        <p>{ msToMinutesAndSeconds(song.duration_ms) }</p>
      </div>
    </li>
))
return (
  <div>
    { tracks.length > 0 && (
      <div className='song-header-container'>
        <div className='song-title-header'>
          <p>Title</p>
        </div>
        <div className='song-artist-header'>
          <p>Artist</p>
        </div>
        <div className='song-album-header'>
          <p>Album</p>
        </div>
        <div className='song-added-header'>
          <i className="fa fa-calendar-plus-o" aria-hidden="true"/>
        </div>
        <div className='song-length-header'>
          <p><i className="fa fa-clock-o" aria-hidden="true" /></p>
        </div>
      </div>
    )}
      {tracks}
    </div>
  )
}
