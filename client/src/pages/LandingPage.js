import React from 'react';
import '../styles/LandingPage.css';
import Button from '../components/Button';
import lmfao from '../static/kaizenworld.jpg';
import Logo from '../static/logo.svg';

export default function() {
  const isError = window.location.href.includes('access_denied');
  return (
    <div className="Hero">
      <div className="top">
        <img src={Logo} alt='Spotify Logo' />
        <h1 className="title"> Spotification </h1>
      </div>
      <p className="sideways"> KAIZEN </p>
      <p className="sideways left"> WORLD </p>
      <Button to="/login">Connect to Spotify</Button>
      {isError  ? (<h2 className="error"> Please Log In! </h2>) : "" }
    </div>
  )
}