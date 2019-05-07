import React, { Component } from "react";
import Header from '../components/Header';
import MediaQuery from 'react-responsive';

import 'react-circular-progressbar/dist/styles.css';
import '../styles/Layout.css';
import '../styles/Profile.css';

import { Bar } from 'react-chartjs-2';
import DarkCard from '../components/DarkCard'
import ProfileBarGraph from '../components/ProfileBarGraph'
import CircularProgressbar from 'react-circular-progressbar';
import Chart from '../components/Chart';
import axios from "axios";
import Cookies from 'js-cookie';

class Profile extends Component {
	constructor(props){
    super(props);
    this.state = {
      profileData: {},
      err: ''
    };
  }

	componentDidMount(){
    axios.get(`/user/username/${this.props.profileName}`, { headers : { 'Authorization' : 'Bearer ' + Cookies.get('cookie') }})
    .then(res => {
      let { data } = res;
      this.setState({ profileData: data });
      console.log(this.state);
    })
    .catch(err => {
      console.log(err)
    })
	}

  spotifyData = () => {
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

  SongList = (topSongs) => {
    let songs = topSongs.slice(0,10).map((item =>
      <li>{item}</li>
    ))
    return (
      <ul>
        <li>{songs}</li>
      </ul>
    )
  }

  render() {
    const { profileData, err } = this.state;
    const { listeningData, images } = profileData;
    const { data, location, profileName } = this.props;
    const { username } = data;

    let topSongs, sortedGenres, barData, similarity;
    if (listeningData) {
      similarity = profileData.similarity;
      topSongs = Object.entries(listeningData.songs).map(item => `${item[1].name} by ${item[1].artists[0].name}`)
      sortedGenres = listeningData.sortedGenres;
      barData = sortedGenres.map(g => [g.genre, g.count]).slice(0, 7);
    }

    let avatar = "https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg";
    if (images && images[0] && images[0]['url']){
      console.log(avatar)
      avatar = images[0]['url'];
    }

    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            <MediaQuery query="(min-width: 768px)">
              <img className="avatar" src={avatar} />
            </MediaQuery>
            <h1>{profileName}</h1>
            { username !== profileName && (<div className="similarity-container">
              <h2>Similarity Score</h2>
              { similarity && (
                <CircularProgressbar
                  className="similarity"
                  percentage={similarity}
                  text={`${Number(similarity.toFixed(2))}%`}
                  styles={{
                    root: {},
                    path: {
                      stroke: `#1db954`,
                      strokeLinecap: 'butt',
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                    },
                    trail: {
                      stroke: '#d6d6d6',
                    },
                    text: {
                      fill: '#fff',
                      fontSize: '16px',
                    },
                    background: {
                      fill: '#3e98',
                    },
                  }}
                />
              )}
            </div>)}
          </div>
          <div className="content">
            <h1>{!!err.length && err }</h1>
            <div className="top-row">
              <DarkCard>
                <h1> Top Songs </h1>
                { listeningData && this.SongList(topSongs)}
              </DarkCard>
              <DarkCard>
                <h1> Favorite Genres</h1>
                { listeningData && <ProfileBarGraph label={"Count"} barData={barData} />}
              </DarkCard>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile;
