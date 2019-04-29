import React from 'react';
import PropTypes from 'prop-types';
import '../styles/BrowseView.css';

const BrowseView = ({ items }) => {
  const browseView = items.map((item, i) => {
    return(
      <li  className='category-item' key={ i }>
        <div className='category-image'>
          <img src={item.imageUrl}/>
            <p className='category-name'>{ item.name }</p>
        </div>
      </li>
    );
  });

  return (
    <ul className='browse-view-container'>
      { browseView }
    </ul>
  );
};

BrowseView.propTypes = {
  items: PropTypes.array,
}

BrowseView.defaultProps = {
  items: [
    {
      name: 'Hip-Hop',
      imageUrl: 'https://t.scdn.co/media/original/hip-274_0a661854d61e29eace5fe63f73495e68_274x274.jpg'
    }
  ]
}

export default BrowseView;