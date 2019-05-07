import React, { Component } from "react";
import Header from '../components/Header';
import MediaQuery from 'react-responsive';

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

    let topSongs, sortedGenres, barData=[], similarity, chartExample2, chart1_2_options, avatar, artist;
    if (listeningData) {
      similarity = profileData.similarity;
      topSongs = Object.entries(listeningData.songs).map(item => `${item[1].name} by ${item[1].artists[0].name}`)
      artist = listeningData.songs[0].artists[0].name;
      sortedGenres = listeningData.sortedGenres;
      barData = sortedGenres.map(g => [g.genre, g.count]).slice(0, 7);

      avatar = "https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg";
      if (images && images[0] && images[0]['url']){
        console.log(avatar)
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

    return (
      <main>
        <Header name={username} location={location} />
            <h1>{!!err.length && err}</h1>
            {/* <Chart title="aaaaa"> */}
            {/* <DarkChart /> */}
            {/* </Chart> */}
            {/* <DarkCard>
                <h1> Top Songs </h1>
                { listeningData && this.SongList(topSongs)}
              </DarkCard>
              <DarkCard>
                <h1> Favorite Genres</h1>
                { listeningData && <ProfileBarGraph label={"Count"} barData={barData} />}
              </DarkCard> */}
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
                  <h6 class="track-info--intro">Hey {profileName}!</h6>
                  { listeningData && (
                    <h1 class="track-info--title">You like {barData[0][0]} and {artist}!</h1>
                  )}
                  {/* <h2 class="track-info--artist">aaa</h2> */}
                </section>
                </div>

                <div class="main-overview">
                  <div class="overviewcard">
                    <div class="overviewcard__icon">Overview</div>
                    <div class="overviewcard__info">Card</div>
                  </div>
                  <div class="overviewcard">
                    <div class="overviewcard__icon">Overview</div>
                    <div class="overviewcard__info">Card</div>
                  </div>
                  <div class="overviewcard">
                    <div class="overviewcard__icon">Overview</div>
                    <div class="overviewcard__info">Card</div>
                  </div>
                  <div class="overviewcard">
                    <div class="overviewcard__icon">Overview</div>
                    <div class="overviewcard__info">Card</div>
                  </div>
                </div>

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
