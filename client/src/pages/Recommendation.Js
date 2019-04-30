import React, { Component } from "react";
import classNames from 'classnames';
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
      currentTab: 'Songs',
      songResults: [],
      artistResults: [],
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
    let tabState = 'track', resultsType = 'tracks', stateType = 'songResults';
    if (this.state.currentTab === 'Artists') {
      tabState = 'artist';
      resultsType = 'artists';
      stateType = 'artistResults';
    }
    else if (this.state.currentTab === 'Album') {
      tabState = 'album';
      resultsType = 'albums';
      stateType = 'albumResults';
    }
    axios.get(`/search?search=${this.state.query}&searchType=${tabState}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      if (res.data[resultsType].items) {
        this.setState({ [stateType]: res.data[resultsType].items, displayRecs: false })
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
    let { seedTracks, seedArtists, seedGenres } = this.state;
    if ((seedTracks.length + seedArtists.length + seedGenres.length) > 4) {
      alert('Please don\'t add more than 5 seeds!');
    } else {
      seedTracks.push(song);
      this.setState({ seedTracks });
    }
  }

  handleAlbumClick = (artist) => {
    let { seedTracks, seedArtists, seedGenres } = this.state;
    if ((seedTracks.length + seedArtists.length + seedGenres.length) > 4) {
      alert('Please don\'t add more than 5 seeds!');
    } else {
      seedArtists.push(artist);
      this.setState({ seedArtists });
    }
  }

  removeFromSeeds(seedType, deletedSeed){
    let { seedTracks, seedArtists, seedGenres } = this.state
    console.log("why");
    if (seedType == 'track'){
      seedTracks = seedTracks.filter((seedTrack) => (deletedSeed.id != seedTrack.id));
      this.setState({ seedTracks })
      }
    if (seedType == 'artist'){
      seedArtists = seedArtists.filter((seedArtist) => (deletedSeed.id != seedArtist.id));
      this.setState({ seedArtists })
      }
  }

  handleSubmitRec = (e) => {
    e.preventDefault();
    let trackIds = this.state.seedTracks.map(track => track.id);
    let artistIds = this.state.seedArtists.map(artist => artist.id);
    axios.post('/queries/recommend', { seedTracks: trackIds, seedArtists: artistIds }, { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
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
    const { currentTab, songResults, artistResults, displayRecs, recTracks, seedTracks, seedArtists, seedGenres } = this.state;
    const { username } = data;

    const songTabStyles = classNames('tab', { 'active': currentTab === 'Songs' })
    const artistTabStyles = classNames('tab', { 'active': currentTab === 'Artists' })
    const genreTabStyles = classNames('tab', { 'active': currentTab === 'Genres' })

    const showRecs = (recTracks.length > 0 && displayRecs);
    const seedTracksDisplay = seedTracks.map((track, i) => {
      return (
        <MediaListItem name={track.name} primaryContext={track.artists[0].name} coverArtUrl={track.album.images[0].url}/>
      )
    })
    const seedArtistsDisplay = seedArtists.map((artist, i) => {
      return (
        <MediaListItem name={artist.name} coverArtUrl={artist.images[0] ? artist.images[0].url : ''}/>
      )
    })

    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            <p>Currently Selected ({seedTracks.length + seedArtists.length})</p>
            { seedTracks.length > 0 && (<>
              { seedTracksDisplay }
            </>)}
            { seedArtists.length > 0 && (<>
              { seedArtistsDisplay }
            </>)}
            { (seedTracks.length + seedArtists.length) > 0 && (<>
              <Button onClick={(e) => this.handleSubmitRec(e)}>Get Recs</Button>
            </>)}
          </div>

          <div className="content">
            <div className="tabs">
              <Tabs>
                <TabList className="browse-headers">
                  <Tab onClick={() => this.setState({ currentTab: 'Songs' })} className={songTabStyles}> Songs </Tab>
                  <Tab onClick={() => this.setState({ currentTab: 'Artists' })} className={artistTabStyles}> Artists </Tab>
                  <Tab onClick={() => this.setState({ currentTab: 'Genres' })} className={genreTabStyles}> Genres </Tab>
                </TabList>
                <TabPanel>
                  <Search
                    handleChange={this.handleQueryChange}
                    handleQuery={this.handleQuery}
                  />
                  { songResults.length > 0 ? "" : ( <p> Nothing to see here...</p>)}
                  { showRecs ? (<>
                    <h2> Recommendations </h2>
                    <SongList songs={recTracks} />
                  </>) : (
                    <SongList handleClick={this.handleSongClick} songs={songResults} />
                  )}
                </TabPanel>
                <TabPanel>
                  <Search
                    handleChange={this.handleQueryChange}
                    handleQuery={this.handleQuery}
                  />
                  { artistResults.length > 0 ? "" : ( <p> Nothing to see here...</p>)}
                  { showRecs ? (<>
                    <h2> Recommendations </h2>
                    <SongList songs={recTracks} />
                  </>) : (
                    <ArtistView handleClick={this.handleAlbumClick} artists={artistResults}/>
                  )}
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
