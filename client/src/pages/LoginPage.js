import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';

import '../styles/LoginPage.css';

const classNames = require('classnames');

async function login(username, password) {
  try {
    const code = localStorage.getItem('_token');
    if (!code) throw new Error ('Please have a spotify authorization code');
    const res = await fetch('/user/spotifyauth', {
      method: 'POST',
      body: {
        code,
        username,
        password
      }
    });
    const data = res.json();
  } catch (err) {
    console.error(err);
  }
}

export default function() {
  const [isSignup, setSignup] = useState(false);
  const [email, setEmail] = useState('');
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

  const text = isSignup ? "Sign Up" : "Sign in";
  const text2 = isSignup ? "Sign In" : "Sign up";
  const testemail = emailRef;

  const emailRef = React.createRef();
  const passRef = React.createRef();
  return (
    <div className="wrap">
      <div className={containerClass}>
        <div className={formClass}>
          <h2> Welcome to Spotification!</h2>
          <form className="information" onSubmit={()=>{console.log(emailRef)}}>
            <h1>{text}</h1>
            <Input type="text" placeholder="Email" ref={emailRef} fullWidth/>
            <Input type="text" placeholder="Password" ref={passRef} fullWidth/>
            <a className="subText" href="#">Forgot your password?</a>
            <button>click</button>
            <Button type = 'submit'/*onClick={() => {
                  setSignup(!isSignup);
                  setEmail(emailRef)  
                  console.log(isSignup)
                  console.log(testemail)
                  axios.post('/user',{username: testemail}, {password: passRef.current})
                }}
                */
              //  to="/home"
                >{text}</Button>
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
                onClick={() => 
                  setSignup(!isSignup)
                }
              >{text2}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}