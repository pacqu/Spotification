import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Register extends Component {
    render() {
        return(
            <div>
                <input type='text' placeholder='username' ref='username'></input>
                <br/>
                <input type='text' placeholder='password' ref='password'></input>
                <br/>
                <Link to="/home">
                  <button>Sign In</button>
                </Link>   
            </div>
        )
    }
  }

export default Register;