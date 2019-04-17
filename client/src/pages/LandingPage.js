import React from 'react';
import '../styles/LandingPage.css';
import Button from '../components/Button';
import lmfao from '../static/kaizenworld.jpg';
import Logo from '../static/logo.svg';
import { Link } from 'react-router-dom';

export default function() {
  const isError = window.location.href.includes('access_denied');
  return (
    <div className="wrap">
      <div className="top">
        {/* <img src={Logo} alt='Spotify Logo' /> */}
        <div className="picture-container" />
        <h1 className="title"> Spotification </h1>
      </div>
      <Link to="/login">
        <Button>
          Sign in
        </Button>
      </Link>
      {isError  ? (<h2 className="error"> Please Log In! </h2>) : "" }
    </div>
  )
}