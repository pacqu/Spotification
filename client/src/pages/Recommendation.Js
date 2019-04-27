import React, { Component } from "react";
import Header from '../components/Header';
import Search from '../components/Search';
import Button from "../components/Button";
import MediaQuery from 'react-responsive';
import '../styles/Home.css';
import axios from "axios";
import Cookies from "js-cookie";

class Recommendation extends Component {
	constructor(props){
    super(props);
    this.state = {
      displayRecs: false,
      seedTracks: [],
      seedArtists: [],
      seedGenres: []
    }
	}

  recOnTrackClick = (e, tracks) => {
    if (e.currentTarget.dataset.id) {
      let seedTracks = this.state.seedTracks;
      if (seedTracks.length <=4){
        seedTracks.push(tracks[e.currentTarget.dataset.id]);
        this.setState({seedTracks: seedTracks});
        //console.log(this.state.seedTracks)
      }
    }
  }

  removeFromTracks(e, track){
    let filteredSeedTracks = this.state.seedTracks.filter((seedTrack) => {
      return (track.name != seedTrack.name) || (track.artists[0].name != seedTrack.artists[0].name) || (track.album.name != seedTrack.album.name)
    });
    this.setState({
      seedTracks: filteredSeedTracks
    })
    console.log(filteredSeedTracks);
  }

  handleSubmitRec = (e) => {
    e.preventDefault();
    let trackIds = this.state.seedTracks.map(track => track.id);
    console.log(trackIds);
    axios.post('/queries/recommend',
    { seedTracks: trackIds},
    { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
    .then(res => {
      console.log(res.data);
      this.setState({
        displayRecs: true,
        recTracks: res.data
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    const { data, location } = this.props;
    const { username } = data;
    let seedTrackDisplay = [];
    if (this.state.seedTracks !== undefined && this.state.seedTracks.length > 0){
      seedTrackDisplay = this.state.seedTracks.map((track,i) => {
          return(<li data-id={i} onClick={(e) => this.removeFromTracks(e,this.state.seedTracks[i])} >{track.name} by {track.artists[0].name} of {track.album.name}</li>)
      })
    }
    let content = (
      <div className="content">
      <Search onTrackClick={this.recOnTrackClick}/>
      <h5>Selected Seed Tracks</h5>
      {seedTrackDisplay}
      <Button onClick={(e) => this.handleSubmitRec(e)}>Get Recommendations</Button>
      </div>
    )
    if (this.state.displayRecs){
      let recDisplay = []
      if (this.state.recTracks !== undefined && this.state.recTracks.length > 0){
        recDisplay = this.state.recTracks.map((track,i) => {
            return(<li data-id={i} >{track.name} by {track.artists[0].name} of {track.album.name}</li>)
        })
        content = (
          <div className="content">
          <h3>Recommendations</h3>
          {recDisplay}
          </div>
        )
      }
    }

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
          {content}
        </div>
      </main>
    )
  }
}

export default Recommendation;
