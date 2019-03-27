import React from 'react';
import '../styles/Home.css';
import Spotify from '../utils/spotify';

export default function() {
  let _token = Spotify.getAccessToken();
  console.log(_token)
  return (
    <div> Home i think </div>
  )
}