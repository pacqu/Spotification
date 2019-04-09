import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import Cookies from "js-cookie";
import '../styles/LoginPage.css';

const classNames = require("classnames");

class Register extends Component {
  state = {
    isSignup: false,
    email: "",
    pass: "",
    LnR: true,
    notice: "",
    spotifyAuthUrl: ""
  };

  makeState = name => ({ target }) => {
    this.setState({ [name]: target.value })
    console.log(this.state)
  };

  handleChange = () => {
    this.setState({
      isSignup: !this.state.isSignup
    });
  };

  handleSignup = () => {
    if (!this.state.isSignup) {
      axios
        .post(
          "/user/login",
          { username: this.state.email },
          { password: this.state.pass }
        )
        .then(res => {
          console.log(res);
          Cookies.set("cookie", res.data.token);
          this.setState({
            LnR: false,
            spotifyAuthUrl: res.data.user.spotifyAuthUrl,
            notice: ""
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            notice: "User Does Not Exist"
          });
        });
    } else {
      axios
        .post(
          "/user",
          { username: this.state.email },
          { password: this.state.pass }
        )
        .then(res => {
          console.log('hello')
          console.log(res);
          const { token } = res.data;
          Cookies.set("cookie", token);
          this.setState({
            LnR: false,
            spotifyAuthUrl: res.data.user.spotifyAuthUrl,
            notice: ""
          });
        })
        .catch(err => {
          this.setState({
            notice: "User Exists! Try Again"
          });
        });
    }
  };

  componentDidMount() {
    if (window.location.href.indexOf("code=") != -1){
      var authCode = window.location.href.split("code=")[1];
      if (authCode.indexOf("&")) authCode = authCode.split("&")[0];
      console.log(authCode);
      axios.post('/user/spotifyauth',
      { code: authCode},
      { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
      .then(res => {
        console.log(Cookies.get('token'));
        console.log(res);
        this.setState({ LnR: false, email: res.data[0].username, spotifyAuth: res.data[0].spotifyAuth, spotifyAuthUrl: res.data[0].spotifyAuthUrl,});
      })
      .catch(err => {
        console.log(err)
      })
    }
    else{
      axios
      .get("/user/", {
        headers: {
          Authorization: `Bearer ${Cookies.get("cookie")}`
        }
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({ LnR: false, email: res.data[0].username, spotifyAuthUrl: res.data[0].spotifyAuthUrl, spotifyAuth: res.data[0].spotifyAuth});
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  render() {
    var containerClass = classNames({
      container: true,
      "right-panel-active": this.state.isSignup
    });

    var overlayClass = classNames({
      "overlay-panel": true,
      "overlay-right": !this.state.isSignup,
      "overlay-left": this.state.isSignup
    });

    var overlayContainerClass = classNames({
      "overlay-container": true,
      "overlay-container-right": this.state.isSignup
    });

    var formClass = classNames({
      "form-container": true,
      "sign-in-container": !this.state.isSignup,
      "sign-up-container": this.state.isSignup
    });

    var containerClass2 = classNames({
      container: !this.state.LnR
    });

    const text = this.state.isSignup ? "Sign Up" : "Sign in";
    const text2 = this.state.isSignup ? "Sign In" : "Sign up";
    let welcome = this.state.isSignup
      ? "Sign Up Successful!"
      : "Sign in Successful!";
    if (this.state.spotifyAuth){
      return <Redirect to='/home' />;
    }
    return (
      <div>
        {this.state.LnR ? (
          <div className="wrap">
            <div className={containerClass}>
              <div className={formClass}>
                <h2> Welcome to Spotification!</h2>
                <form onSubmit={() => this.handleSignup()} className="information">
                  <h1>{text}</h1>
                  <h1>{this.state.notice}</h1>
                  <Input
                    type="text"
                    placeholder="Email"
                    onChange={this.makeState("email")}
                    fullWidth
                  />
                  <Input
                    type="text"
                    placeholder="Password"
                    onChange={this.makeState("pass")}
                    fullWidth
                  />
                  <a className="subText" href="#">
                    Forgot your password?
                  </a>
                  <Button
                    inverted
                    type="submit"
                  >
                    {text}
                  </Button>
                </form>
              </div>

              <div className={overlayContainerClass}>
                <div className="overlay">
                  <div className={overlayClass}>
                    <h1>Hello, Friend!</h1>
                    {this.state.isSignup ? (
                      <p> Back to sign in </p>
                    ) : (
                      <p> Maybe you want to Sign up?</p>
                    )}
                    <Button
                      onClick={() => this.handleChange()}
                    >
                      {text2}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}

        {!this.state.LnR ? (
          <div className="wrap">
            <div className={containerClass2}>
              <h2> {welcome} </h2>
              <h2> Welcome {this.state.email}!</h2>
              <a href={this.state.spotifyAuthUrl}>
                <Button>Connect to Spotify</Button>
              </a>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Register;
