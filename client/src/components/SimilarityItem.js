import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../styles/SimilarityItem.css';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SimilarityItem = ({ onClick, name, primaryContext, secondaryContext, coverArtUrl, id, type }) => {
  const [simScore, setSimScore] = useState(null);
  useEffect(() => {
    setSimScore(.00001);
    axios.get(`/search/similarity?type=${type}&id=${id}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(result => {
      setSimScore(result.data.score);
      console.log(result);
    })
    .catch(err =>{
      console.log(err);
    })
  },[id])
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
      <div className="similarity-container">
        <h2>Similarity Score</h2>
        { simScore && simScore >= 0 && (
          <CircularProgressbar
            className="similarity"
            percentage={simScore}
            text={`${Number(simScore.toFixed(2))}%`}
            styles={{
              root: {},
              path: {
                stroke: `#1db954`,
                strokeLinecap: 'butt',
                transition: 'stroke-dashoffset 0.5s ease 0s',
              },
              trail: {
                stroke: '#d6d6d6',
              },
              text: {
                fill: '#fff',
                fontSize: '16px',
              },
              background: {
                fill: '#3e98',
              },
            }}
          />
        )}
      </div>
    </div>
  )
}

export default SimilarityItem
