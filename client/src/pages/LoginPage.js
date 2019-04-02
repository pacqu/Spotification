import React, { useState, useEffect } from 'react';
import Spotify from '../utils/spotify';
import Button from '../components/Button';
import Input from '../components/Input';
import '../styles/LoginPage.css';

const classNames = require('classnames');

export default function() {
  const [isSignup, setSignup] = useState(false);
  var containerClass = classNames({
    'container' : true,
    'right-panel-active': isSignup
  })

  var overlayClass = classNames({
    'overlay-panel': true,
    'overlay-right': !isSignup,
    'overlay-left' : isSignup
  })

  var overlayContainerClass = classNames({
    'overlay-container': true,
    'overlay-container-right': isSignup
  })

  var formClass = classNames({
    'form-container'   : true,
    'sign-in-container': !isSignup,
    'sign-up-container': isSignup
  })
  useEffect(() => {
    console.log(isSignup)
  }, [isSignup]);
  const text = isSignup ? "Sign Up" : "Sign in";
  const text2 = isSignup ? "Sign In" : "Sign up";
  return (
    <div className="wrap">
      <div className={containerClass}>
        <div className={formClass}>
          <h2> Welcome to Spotification!</h2>
          <form className="information">
            <h1>{text}</h1>
            <Input type="email" placeholder="Email" fullWidth/>
            <Input type="password" placeholder="Password" fullWidth/>
            <a className="subText" href="#">Forgot your password?</a>
            <Button>{text}</Button>
          </form>
        </div>

        <div className={overlayContainerClass}>
          <div class="overlay">
            <div className={overlayClass}>
              <h1>Hello, Friend!</h1>
              {isSignup ? (
                <p> Back to sign in </p>
              ) : (
                <p> Maybe you want to Sign up?</p>
              )}
              <Button
                className="ghost"
                onClick={() => setSignup(!isSignup)}
              >{text2}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}