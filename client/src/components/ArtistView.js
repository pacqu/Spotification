import React from 'react';
import '../styles/ArtistView.css';
import PropTypes from 'prop-types';

const ArtistView = ({ artists, handleClick }) => {
  const renderArtists = () => {
    console.log(artists)
    return artists.map((artist, i) => {
      return (
        <li className='artist-item' key={ i }>
          <a>
            <div onClick={() => handleClick(artist)}>
              <div className='artist-image'>
                <img src={artist.images[0] ? artist.images[0].url : ''} />
              </div>
              <div className='artist-details'>
                <p>{ artist.name }</p>
              </div>
            </div>
          </a>
        </li>
      );
    });
  };

  return (
    <ul className='artist-view-container'>
      {
        artists && renderArtists()
      }
    </ul>
  );
};

ArtistView.propTypes = {
  artists: PropTypes.array
}

ArtistView.defaultProps = {
  artists: [
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/3MZsBdqDrRTJihTHQrO6Dq"
      },
      "followers": {
        "href": null,
        "total": 1163810
      },
      "genres": [
        "alternative r&b",
        "viral pop"
      ],
      "href": "https://api.spotify.com/v1/artists/3MZsBdqDrRTJihTHQrO6Dq",
      "id": "3MZsBdqDrRTJihTHQrO6Dq",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/1f9fd82785c277541b36901546bdbd72e53cd5f1",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/2941e852aeb575f31bea798613a00f5ebb737f5b",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/12e3fbaca846a1c2affe9adc54e1052780cc7300",
          "width": 160
        }
      ],
      "name": "Joji",
      "popularity": 82,
      "type": "artist",
      "uri": "spotify:artist:3MZsBdqDrRTJihTHQrO6Dq"
    },
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/07EcmJpfAday8xGkslfanE"
      },
      "followers": {
        "href": null,
        "total": 247682
      },
      "genres": [
        "hip hop",
        "lgbtq+ hip hop",
        "pop",
        "rap"
      ],
      "href": "https://api.spotify.com/v1/artists/07EcmJpfAday8xGkslfanE",
      "id": "07EcmJpfAday8xGkslfanE",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/b509b83cfbb108eafcb79b7a93c84b0be0273e8f",
          "width": 640
        },
        {
          "height": 320,
          "url": "https://i.scdn.co/image/666336211b56f044f062702cf1cb0075fb65c615",
          "width": 320
        },
        {
          "height": 160,
          "url": "https://i.scdn.co/image/082d64dbf8fd41abe8ccb47824a4104ff2bd72b1",
          "width": 160
        }
      ],
      "name": "Kevin Abstract",
      "popularity": 71,
      "type": "artist",
      "uri": "spotify:artist:07EcmJpfAday8xGkslfanE"
    }
  ]
}

export default ArtistView;
