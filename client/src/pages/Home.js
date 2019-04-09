import Cookies from "js-cookie";
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import MediaQuery from 'react-responsive';
import '../styles/Home.css';

const axios = require('axios');

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      loadingDone: false,
      name: "Miguel"
    }
  }
  componentDidMount(){
    this.setState({loadingDone: true})
    if (Cookies.get('cookie')){
      axios.get('/user/', { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
      .then(res => {
        console.log(!(res.data[0].spotifyAuth))
        if(!(res.data[0].spotifyAuth)){
          this.setState({loadingDone: true, redirect: "/login"})
        }
        else{
          this.setState({loadingDone: true})
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
    else{
      this.setState({loadingDone: true,redirect: "/login"})
    }
  }
  render() {
    const { name } = this.state;
    if (this.state.loadingDone){
      if (this.state.redirect) return <Redirect to={this.state.redirect} />
      return (
        <div className="home-container">
          <Header name={name} location="Home"/>
          <div className="sidebar">
            this is the sidebar
            <MediaQuery query="(min-width: 768px)">
              <img className="avatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg" />
            </MediaQuery>
          </div>
          <div className="content">
            this is the content
          </div>
          {/* <button onClick={(e) =>   {
              e.preventDefault();
              Cookies.remove("cookie");
              this.setState({loadingDone: true,redirect: "/login"});
            }}>log out</button> */}
        </div>
      )
    }
    else return <div>Loading!</div>
  }
}

export default Home;
