import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import MediaQuery from "react-responsive";
import { Bar } from "react-chartjs-2";
import "../styles/Home.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingDone: false,
      location: "Profile",
      username: "",
      features: [],
      featuresName: [],
      featuresValue: [],
      topSongs: []
    };
    this.spotifyData = this.spotifyData.bind(this);
  }
  // Object.entries(res.data[0].listeningData.avgFeatures) -> for each loops thru data
  // Object.entries(res.data[0].listeningData.avgFeatures).filter(item=> item[0] !=="duration_ms") -> filter out ms for now
  // Remove .filter(item=> item[0] !=="duration_ms") => .map(item => item[0]) when graph options fixed.
  spotifyData = () => {
    axios.get("/user/listening-data", {
      headers: { Authorization: "Bearer " + Cookies.get("cookie") }
    })
    .then(res => {
      let array = Object.entries(
        res.data[0].listeningData.avgFeatures
      ).filter(item => item[0] !== "duration_ms");
      this.setState({
        features: array,
        featuresName: array.map(item => item[0]),
        featuresValue: array.map(item => item[1]),
        topSongs: Object.entries(res.data[0].listeningData.songs).map(
          item => item[1].name
        ),
        loadingDone: true
      });
      console.log(this.state.topSongs);
      console.log(Object.entries(res.data));
    });
  };

  BarGraph = props => {
    const data = {
      labels: this.state.featuresName,
      datasets: [
        {
          label: "My Songs",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: this.state.featuresValue
        }
      ]
    };
    return <Bar data={data} />;
  };

  //maps top 3 songs, change number for more or less songs
  SongList = () => {
    let songs = this.state.topSongs.slice(0, 3).map(item => <li>{item}</li>);
    return (
      <ul>
        <h3>My Top Songs</h3>
        <li>{songs}</li>
      </ul>
    );
  };

  componentDidMount() {
    this.setState({loadingDone: true})
    if (Cookies.get('cookie')){
      axios.get('/user/', { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
      .then(res => {
        const { username } = res.data[0]
        if(!(res.data[0].spotifyAuth)){
          this.setState({loadingDone: true, redirect: "/login"})
        }
        else{
          if (res.data[0].listeningData){
            let array = Object.entries(
              res.data[0].listeningData.avgFeatures
            ).filter(item => item[0] !== "duration_ms");
            this.setState({
              features: array,
              featuresName: array.map(item => item[0]),
              featuresValue: array.map(item => item[1]),
              topSongs: Object.entries(res.data[0].listeningData.songs).map(
                item => item[1].name
              ),
              loadingDone: true
            })
          }
          else this.spotifyData()
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
    const { username, location } = this.state;
    if (this.state.loadingDone){
      if (this.state.redirect) return <Redirect to={this.state.redirect} />
      return (
        <main>
          <Header name={username} location={location} logout={this.handleLogout}/>
          <div className="home-container">
            <div className="sidebar">
              This is the sidebar
              <MediaQuery query="(min-width: 768px)">
                <img className="avatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg" />
              </MediaQuery>
            </div>
            <div className="content">
              {this.BarGraph()}
              {this.SongList()}
            </div>
          </div>
        </main>
      )
    }
    else return <div>Loading!</div>
  }
}

export default Profile;
