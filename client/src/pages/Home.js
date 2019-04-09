import Cookies from "js-cookie";
import React, { useEffect, Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/Home.css';

const axios = require('axios');

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      loadingDone: false
    }
  }
  componentDidMount(){
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
    if (this.state.loadingDone){
      if (this.state.redirect) return <Redirect to={this.state.redirect} />
      return (
        <div>
          <div>Home!</div>
          <button onClick={(e) => {
              e.preventDefault();
              Cookies.remove("cookie");
              this.setState({loadingDone: true,redirect: "/login"});
          }}>log out</button>
          <button onClick={(e) => {
              e.preventDefault();
              this.setState({redirect:"/UserProfile"})
          }}>Profile</button>
        </div>
      )
    }
    else return <div>Loading!</div>
  }
}

export default Home;
