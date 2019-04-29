import React, { Component } from "react";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import Header from '../components/Header';
import Search from '../components/Search';
import Button from '../components/Button';
import SongList from '../components/SongList';
import ArtistView from '../components/ArtistView';
import BrowseView from '../components/BrowseView';
import MediaListItem from '../components/MediaListItem';
import MediaQuery from 'react-responsive';

import axios from "axios";
import Cookies from "js-cookie";

import '../styles/Recommendation.css';
import '../styles/Layout.css';

class Recommendation extends Component {
	constructor(props){
    super(props);
    this.state = {
      displayRecs: false,
      results: [],
      recTracks: [],
      artistResults: [],
      genres: [],
      seedTracks: [],
      seedArtists: [],
      seedGenres: [],
      query: ''
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
    if (seedTracks.length > 4) {
      alert('Please don\'t add more than 5 songs!');
    } else {
      seedTracks.push(song);
      this.setState({ seedTracks });
    }
  }

  removeFromTracks(e, track){
    let { seedTracks } = this.state
    seedTracks = seedTracks.filter((seedTrack) => (
      track.name != seedTrack.name) || (track.artists[0].name != seedTrack.artists[0].name) || (track.album.name != seedTrack.album.name
    ));
    this.setState({ seedTracks })
  }

  handleSubmitRec = (e) => {
    e.preventDefault();
    let trackIds = this.state.seedTracks.map(track => track.id);
    axios.post('/queries/recommend', { seedTracks: trackIds }, { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
    .then(res => {
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
    const { results, displayRecs, recTracks, seedTracks, seedArtists, seedGenres } = this.state;
    const { username } = data;

    const showRecs = (recTracks.length > 0 && displayRecs);
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
              <Button onClick={(e) => this.handleSubmitRec(e)}>Get Recs</Button>
            </>)}
          </div>

          <div className="content">
            <div className="tabs">
              <Tabs>
                <TabList className="browse-headers">
                  <Tab className="tab active"> Songs </Tab>
                  <Tab className="tab"> Artists </Tab>
                  <Tab className="tab"> Genres </Tab>
                </TabList>
                <TabPanel>
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
                </TabPanel>
                <TabPanel>
                  <h2> Artists </h2>
                  <Search />
                  <ArtistView />
                </TabPanel>
                <TabPanel>
                  <h2> Genres </h2>
                  <Search />
                  <BrowseView />
                </TabPanel>
              </Tabs>
            </div>
            
          </div>
        </div>
      </main>
    )
  }
}

export default Recommendation;
