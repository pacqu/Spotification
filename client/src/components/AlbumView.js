import React from 'react';
import PropTypes from 'prop-types';
import '../styles/AlbumView.css';

const AlbumView = ({ albums, handleClick }) => {
  const renderAlbums = () => {
    return albums.map((album, i) => {
      return (
        <li
          className='album-item'
          onClick={() => handleClick(album)}
          key={ i }
        >
          <div>
            <div className='album-image'>
              <img src={album.images[0].url} />
              <div className='play-song'>
                <i className="fa fa-play-circle-o play-btn" aria-hidden="true" />
              </div>
            </div>

            <div className='album-details'>
              <p className='album-name'>{ album.name }</p>
              <p className='artist-name'>{ album.artists[0].name }</p>
            </div>
          </div>
        </li>
      );
    });
  };

  return (
    <ul className='album-view-container'>
      {renderAlbums()}
    </ul>
  );

};

AlbumView.propTypes = {
  songs: PropTypes.array,
  audioControl: PropTypes.func
};

export default AlbumView;