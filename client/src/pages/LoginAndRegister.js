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
    username: "",
    password: "",
    LnR: true,
    notice: "",
    spotifyAuthUrl: ""
  };

  makeState = name => ({ target }) => {
    this.setState({ [name]: target.value })
  };

  handleChange = () => {
    this.setState({
      isSignup: !this.state.isSignup
    });
  };

  handleSignup = (e) => {
    e.preventDefault();
    if (!this.state.isSignup) {
      const { username, password } = this.state;
      axios
        .post("/user/login", { username, password })
        .then(res => {
          Cookies.set("cookie", res.data.token);
          console.log(res.data)
          console.log('here')
          this.setState({
            LnR: false,
            spotifyAuthUrl: res.data.user.spotifyAuthUrl,
            spotifyAuth:res.data.user.spotifyAuth,
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
      const { username, password } = this.state;
      axios
        .post("/user/", { username, password })
        .then(res => {
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
        this.setState({ LnR: false, username: res.data[0].username, spotifyAuth: res.data[0].spotifyAuth, spotifyAuthUrl: res.data[0].spotifyAuthUrl,});
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
          this.setState({ LnR: false, username: res.data[0].username, spotifyAuthUrl: res.data[0].spotifyAuthUrl, spotifyAuth: res.data[0].spotifyAuth});
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  render() {
    const { isSignup, spotifyAuth, LnR, username, spotifyAuthUrl } = this.state;
    var containerClass = classNames({
      container: true,
      "right-panel-active": isSignup
    });

    var overlayClass = classNames({
      "overlay-panel": true,
      "overlay-right": isSignup,
      "overlay-left": isSignup
    });

    var overlayContainerClass = classNames({
      "overlay-container": true,
      "overlay-container-right": isSignup
    });

    var formClass = classNames({
      "form-container": true,
      "sign-in-container": !isSignup,
      "sign-up-container": isSignup
    });

    var containerClass2 = classNames({
      container: !LnR
    });

    const text = isSignup ? "Sign Up" : "Sign in";
    const text2 = isSignup ? "Sign In" : "Sign up";
    let welcome = isSignup
      ? "Sign Up Successful!"
      : "Sign in Successful!";
    if (spotifyAuth){
      return <Redirect to='/home' />;
    }
    return (
      <div>
        {this.state.LnR ? (
          <div className="wrap">
            <div className={containerClass}>
              <div className={formClass}>
                <h2 className="black"> Welcome to Spotification!</h2>
                <form onSubmit={this.handleSignup} className="information">
                  <h1 className="black">{text}</h1>
                  <h1 className="black">{this.state.notice}</h1>
                  <Input
                    type="text"
                    placeholder="Username"
                    onChange={this.makeState("username")}
                    fullWidth
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    onChange={this.makeState("password")}
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

        {!LnR ? (
          <div className="wrap">
            <div className={containerClass2}>
              <h2 className="black"> {welcome} </h2>
              <h2 className="black"> Welcome {username}!</h2>
              <a href={spotifyAuthUrl}>
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
