import React, { Component } from "react";
import Header from '../components/Header';
import Search from '../components/Search';
import Button from '../components/Button';
import SongList from '../components/SongList';
import MediaListItem from '../components/MediaListItem';
import axios from "axios";
import Cookies from "js-cookie";
import { Bar, Line } from 'react-chartjs-2';

import '../styles/Recommendation.css';
import '../styles/Layout.css';

class DataVisualizations extends Component {
	constructor(props){
    super(props);
    this.state = {
      displayChoice: false,
      currentTab: 'Songs',
      results: [],
      recTracks: [],
      artistResults: [],
      genres: [],
      seedTracks: [],
      seedArtists: [],
      seedGenres: [],
      query: '',
      search: true,
      visual: false,
      features: [],
			featuresName: [],
      featuresValue: []
    }
  }

  handleQuery = e => {
    e.preventDefault();
    axios.get(`/search?search=${this.state.query}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      if (res.data.tracks.items) {
        this.setState({ results: res.data.tracks.items })
      }
      console.log(this.state)
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleQueryChange = e => {
    this.setState({ query: e.target.value })
    console.log(this.state)
  }

  handleSongClick = (song) => {
    let { seedTracks } = this.state;
    if (seedTracks.length > 1) {
      alert('Please don\'t add more than 2 songs!');
    } else {
      seedTracks.push(song);
      this.setState({ seedTracks });
    }
  }

  removeFromTracks(e, track){
    let { seedTracks } = this.state
    seedTracks = seedTracks.filter((seedTrack) => (
      track.name !== seedTrack.name) || (track.artists[0].name !== seedTrack.artists[0].name) || (track.album.name !== seedTrack.album.name
    ));
    this.setState({ seedTracks })
  }

  handleSubmitVisual = (e) => {
    e.preventDefault();
    let trackIds = this.state.seedTracks.map(track => track.id);
    // axios.get(`/search/song/${trackIds}`, { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
    // .then(res => {
    //   console.log(res);
    // })
    // .catch(err => {
    //   console.log(err);
    // })
    this.setState({
      visual:true,
      search:false
    })
  }

  componentDidMount(){
    this.spotifyData()
  }

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

  BarGraph = () => {
    const data = {
      labels: this.state.featuresName,
      datasets: [
        {
          label: "My Songs", 
          backgroundColor: 'rgba(255,225,225,.3)',
          data: this.state.featuresValue
        },
        {
          label: "My Songs",
          backgroundColor: 'rgba(255,225,225,.7)',
          data: this.state.featuresValue
        }
      ]
    };
    return <Bar data={data} />;
  };

  render() {
    const { data, location } = this.props;
    const { results, displayChoice, recTracks, seedTracks, seedArtists, seedGenres } = this.state;
    const { username } = data;
    const showRecs = (recTracks.length > 0 && displayChoice);
    const seedTracksDisplay = seedTracks.map((track, i) => {
      return (
        <MediaListItem name={track.name} primaryContext={track.artists[0].name} coverArtUrl={track.album.images[0].url} />
      )
    })

    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            <p>Currently Selected ({seedTracks.length})</p>
            { seedTracks.length > 0 && (<>
              { seedTracksDisplay }
              <Button onClick={(e) => this.handleSubmitVisual(e)}>Data</Button>
            </>)}
          </div>

        {this.state.search?(   
          <div className="content">
            <Search
              handleChange={this.handleQueryChange}
              handleQuery={this.handleQuery}
              />
              { results.length > 0 ? "" : ( <p> Nothing to see here...</p>)}
              { showRecs ? (<>
              <h2> Recommendations </h2>
              <SongList songs={recTracks} />
              </>) : (
              <SongList handleClick={this.handleSongClick} songs={results} />
              )}
          </div>
        ) : (
          <div />
        )}

        {this.state.visual?(
          <div>
          {this.BarGraph()}
          </div>
        ) : (
          <div />
        )}

        </div>
      </main>
    )
  }
}

export default DataVisualizations;

