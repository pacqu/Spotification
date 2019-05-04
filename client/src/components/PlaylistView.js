import React from 'react';
import PropTypes from 'prop-types';
import '../styles/AlbumView.css';

const PlaylistView = ({ playlists, handleClick }) => {
  const renderPlaylists = () => {
    return playlists.map((playlist, i) => {
      return (
        <li
          className='album-item'
          onClick={() => handleClick(playlist)}
          key={ i }
        >
          <div>
            <div className='album-image'>
              <img src={playlist.images[0].url} />
              <div className='play-song'>
                <i className="fa fa-play-circle-o play-btn" aria-hidden="true" />
              </div>
            </div>

            <div className='album-details'>
              <p className='album-name'>{ playlist.name }</p>
              <p className='artist-name'>{ playlist.owner.display_name }</p>
            </div>
          </div>
        </li>
      );
    });
  };

  return (
    <ul className='album-view-container'>
      {renderPlaylists()}
    </ul>
  );

};


export default PlaylistView;
