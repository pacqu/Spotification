import React, { Component } from "react";
import Header from '../components/Header';
import MediaQuery from 'react-responsive';

import '../styles/Layout.css';
import '../styles/Profile.css';

import { Bar } from 'react-chartjs-2';
import HorizontalBarGraph from '../components/HorizontalBarGraph'
import Chart from '../components/Chart';

class Profile extends Component {
	constructor(props){
    super(props);
    this.state = {
    };
  }

	componentDidMount(){
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
    const { data, location } = this.props;
    const { username, listeningData } = data;

    const topSongs = Object.entries(listeningData.songs).map(item => [item[1].artists.name, item[1].name])
    const { sortedGenres } = listeningData;
    const barData = sortedGenres.map(g => [g.genre, g.count]).slice(0, 7);

    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            This is the sidebar
            <MediaQuery query="(min-width: 768px)">
              <img className="avatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg" />
            </MediaQuery>
          </div>
          <div className="content">
            <Chart title="My Top Songs" className="chart">
              {this.SongList(topSongs)}
            </Chart>
            <Chart title="Favorite Genres" className="chart">
              <HorizontalBarGraph label={"Count"} barData={barData} />
            </Chart>
            <Chart title="Bar data">
              {this.BarGraph()}
            </Chart>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile;