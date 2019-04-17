import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import MediaQuery from 'react-responsive';
import '../styles/Home.css';

class DataVisualizations extends Component {
	constructor(props){
    super(props);
    this.state = {
      location: "My Data"
		}
	}

  componentDidMount(){
    this.setState({loadingDone: true})
    if (Cookies.get('cookie')){
      axios.get('/user/', { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
      .then(res => {
				console.log(res)
        console.log(!(res.data[0].spotifyAuth))
        if(!(res.data[0].spotifyAuth)){
          this.setState({loadingDone: true, redirect: "/login"})
        }
        else{
					this.setState({
						loadingDone: true,
						name: res.data[0].username,
					})
					this.spotifyData();
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
    const { location } = this.state;
    if (this.state.loadingDone){
      if (this.state.redirect) return <Redirect to={this.state.redirect} />
      return (
        <main>
          <Header location={location} logout={this.handleLogout}/>
          <div className="home-container">
            <div className="sidebar">
              This is the sidebar
              <MediaQuery query="(min-width: 768px)">
                <img className="avatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg" />
              </MediaQuery>
            </div>
            <div className="content">
							<p>stuff</p>
            </div>
          </div>
        </main>
      )
    }
    else return <div>Loading!</div>
  }
}


export default DataVisualizations;

