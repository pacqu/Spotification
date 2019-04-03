import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import axios from 'axios';
import Cookies from 'js-cookie';

const classNames = require('classnames');

class Register extends Component {
    state ={
        isSignup: false,
        email: '',
        pass: '',
        LnR: true,
        notice: ''
    }

    makeState = name => ({ target }) =>
        this.setState({ [name]: target.value });

    handleChange = () =>{
        this.setState({
            isSignup: !this.state.isSignup
        })
        console.log(this.state.isSignup)
    }

    handleSignup = () =>{
        if(!this.state.isSignup){
            axios.post('/user',{username: this.state.email}, {password: this.state.pass})
            .then(res=>{
                console.log(res)
                console.log(res.data)
                console.log(res.data.token)
                Cookies.set('cookie',res.data.token)
                this.setState({
                    LnR: false
                })
            })
            .catch(err =>{
                this.setState({
                    notice: "User Does Not Exist"
                })
            })
        }
        else{
            axios.post('/user',{username: this.state.email}, {password: this.state.pass})
            .then(res=>{
                console.log(res.data.token)
                Cookies.set('cookie',res.data.token)
                this.setState({
                    LnR: false
                })
            })
            .catch(err =>{
                this.setState({
                    notice: "User Exists! Try Again"
                })
            })            
        }
    }
    
    render() {
        var containerClass = classNames({
          'container' : true,
          'right-panel-active': this.state.isSignup
        })
      
        var overlayClass = classNames({
          'overlay-panel': true,
          'overlay-right': !this.state.isSignup,
          'overlay-left' : this.state.isSignup
        })
      
        var overlayContainerClass = classNames({
          'overlay-container': true,
          'overlay-container-right': this.state.isSignup
        })
      
        var formClass = classNames({
          'form-container'   : true,
          'sign-in-container': !this.state.isSignup,
          'sign-up-container': this.state.isSignup
        })

        var containerClass2 = classNames({
            'container' : !this.state.LnR
        })

        var formClass2 = classNames({
            'form-container'   : !this.state.LnR,
        })
      
        const text = this.state.isSignup ? "Sign Up" : "Sign in";
        const text2 = this.state.isSignup ? "Sign In" : "Sign up";
        
        const welcome = this.state.isSignup? "Sign Up Successful!" : "Sign in Successful!";
        this.email = React.createRef();
        return (
            <div>
                {this.state.LnR ?(
                <div className="wrap">
                    <div className={containerClass}>
                        <div className={formClass}> 
                            <h2> Welcome to Spotification!</h2>
                            <form className="information" >
                                <h1>{text}</h1>
                                <Input type="text" placeholder="Email" onChange={this.makeState('email')} fullWidth/>
                                <Input type="text" placeholder="Password" onChange={this.makeState('pass')} fullWidth/>
                                <a className="subText" href="#">Forgot your password?</a>
                                <Button onClick={() => this.handleSignup()}
                                //  to="/home"
                                    >{text}</Button>
                            </form>
                        </div>
                        
                        <div className={overlayContainerClass}>
                            <div class="overlay">
                                <div className={overlayClass}>
                                    <h1>Hello, Friend!</h1>
                                    {this.state.isSignup ? (
                                        <p> Back to sign in </p>
                                    ) : (
                                        <p> Maybe you want to Sign up?</p>
                                    )}
                                    <Button
                                        className="ghost"
                                        onClick={() => 
                                        this.handleChange()
                                        }
                                    >{text2}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ):<div></div>}

                {!this.state.LnR ?(
                    <div className="wrap">
                        <div className={containerClass2}>
                            <h2> {welcome} </h2>
                            <h2> Welcome {this.state.email}!</h2>
                                <Button>Connect to Spotify</Button>
                        </div>
                    </div>
                ):<div></div>}
            </div>
          )
    }
  }

export default Register;