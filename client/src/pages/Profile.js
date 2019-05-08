import React, { Component } from "react";
import Header from '../components/Header';
import MediaQuery from 'react-responsive';
import { Redirect } from 'react-router-dom';

import 'react-circular-progressbar/dist/styles.css';
import '../styles/Layout.css';
import '../styles/Profile.css';

import { Bar, Line } from 'react-chartjs-2';
import DarkCard from '../components/DarkCard'
import DarkChart from '../components/DarkChart'
import ProfileBarGraph from '../components/ProfileBarGraph'
import CircularProgressbar from 'react-circular-progressbar';
import Chart from '../components/Chart';
import axios from "axios";
import Cookies from 'js-cookie';
import defaultAvatar from '../static/default.png';

import {
  chartExample1,
  chartExample3,
  chartExample4,
} from './charttypes';
class Profile extends Component {
	constructor(props){
    super(props);
    this.state = {
      profileData: {},
      err: '',
      favArtist: ''
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
			axios.get(`/user/username/${this.props.data.username}`, { headers : { 'Authorization' : 'Bearer ' + Cookies.get('cookie') }})
	    .then(res => {
	      let { data } = res;
	      this.setState({ err: err, profileData: data });
	      console.log(this.state);
	    })
	    .catch(err => {
        console.log(err)
	      this.setState({ redirectHome: true });
	    })
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
      <li className="list-item">{item}</li>
    ))
    return (
      <ul className="list-list">
        <li>{songs}</li>
      </ul>
    )
  }

  render() {
    const { profileData, err, redirectHome } = this.state;
    const { listeningData, images } = profileData;
    const { data, location } = this.props;
    const { username } = data;
    const profileName = profileData.username;

    let topSongs, sortedGenres, barData=[], similarity, chartExample2, chart1_2_options, avatar, artist, song1='', song2='', song3='', song4='';
    if (listeningData) {
      similarity = profileData.similarity;
      topSongs = Object.entries(listeningData.songs).map(item => `${item[1].name} by ${item[1].artists[0].name}`)
      artist = listeningData.songs[0].artists[0].name;
      song1 = listeningData.songs[0].album.images[0].url;
      song2 = listeningData.songs[1].album.images[0].url;
      song3 = listeningData.songs[2].album.images[0].url;
      song4 = listeningData.songs[3].album.images[0].url;
      sortedGenres = listeningData.sortedGenres;
      barData = sortedGenres.map(g => [g.genre, g.count]).slice(0, 7);

      avatar = defaultAvatar;
      if (images && images[0] && images[0]['url']){
        avatar = images[0]['url'];
      }
      console.log('barData')
      console.log(barData)

      chart1_2_options = {
        // maintainAspectRatio: false,
        legend: {
          display: false
        },
        // responsive: true,
        scales: {
          pointLabels: {
            fontColor: 'white'
          },
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "white"
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontColor: "white"
              }
            }
          ]
        },
        legend: {
          labels: {
            fontColor: "white"
          }
        }
      };
    }

      chartExample2 = {
        data: canvas => {
          let ctx = canvas.getContext("2d");
      
          let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
      
          gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
          gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
          gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors
      
          return {
            labels: barData.map(m => m[0]),
            datasets: [
              {
                label: "Data",
                fill: true,
                backgroundColor: gradientStroke,
                borderColor: "#1f8ef1",
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: "#1f8ef1",
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: "#1f8ef1",
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: barData.map(m => m[1])
              }
            ]
          };
        },
        options: chart1_2_options
      };
		if (redirectHome) return (<Redirect to="/home" />);

    return (
      <main>
        <Header name={username} location={location} />
            <h1>{!!err.length && err}</h1>
            <div class="grid-container">
              <div class="menu-icon">
                <i class="fas fa-bars header__menu" />
              </div>

              <aside class="sidenav">
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
              </aside>

              <main class="main">
                <div class="main-header">
                <section class="track-info">
                  <h6 class="track-info--intro">Welcome to Spotification Profile!</h6>
                  { listeningData && (
                    <h1 class="track-info--title">{profileName} likes {barData[0][0]} and {artist}!</h1>
                  )}
                  {/* <h2 class="track-info--artist">aaa</h2> */}
                </section>
                </div>

                {song1 && (
                  <div class="main-overview">
                    <div style={{'background': `url("${song1}")`, 'background-size': 'cover'}} class="overviewcard" />
                    <div style={{'background': `url("${song2}")`, 'background-size': 'cover'}} class="overviewcard" />
                    <div style={{'background': `url("${song3}")`, 'background-size': 'cover'}} class="overviewcard" />
                    <div style={{'background': `url("${song4}")`, 'background-size': 'cover'}} class="overviewcard" />
                  </div>
                )}

                <div class="main-cards">
                  {listeningData && (<>
                    <Chart title="Top 10 Genres">
                      <Bar
                        data={chartExample2.data}
                        options={chartExample2.options}
                      />
                    </Chart>
                    <Chart className="chartchart" title="Top 10 songs">
                      { listeningData && this.SongList(topSongs)}
                    </Chart>
                  </>)}
                </div>
              </main>
            </div>
      </main>
    );
  }
}

export default Profile;
