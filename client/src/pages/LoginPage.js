import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import '../styles/LoginPage.css';

const classNames = require('classnames');

export default function() {
  const [isSignup, setSignup] = useState(false);
  var formClass = classNames({
    'form-container': true,
    'sign-in-container': !isSignup,
    'sign-up-container': isSignup
  })
  return (
    <div className="wrap">
      <div className="container">
        <div className={formClass}>
          <h2> Welcome to Spotification!</h2>
          <form className="information">
            <h1>Sign-in</h1>
            <Input type="email" placeholder="Email" fullWidth/>
            <Input type="password" placeholder="Password" fullWidth/>
            <a className="subText" href="#">Forgot your password?</a>
            <Button>Sign in</Button>
          </form>
        </div>
      </div>
    </div>
  )
}