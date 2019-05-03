import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../styles/SimilarityItem.css';

const SimilarityItem = ({ onClick, name, primaryContext, secondaryContext, coverArtUrl, id, type }) => {
  const [simScore, setSimScore] = useState(-1);
  useEffect(() => {
    axios.get(`/search/similarity?type=${type}&id=${id}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(result => {
      console.log(result);
    })
    .catch(err =>{
      console.log(err);
    })
  })
  return (
    <div onClick={onClick} className="similarity-item">
      <div className="item-cover-art">
        <div className="item-cover-art-image" style={{"backgroundImage" : `url(${coverArtUrl})`}}></div>
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

export default SimilarityItem
