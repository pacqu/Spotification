import React, { Component } from "react";
import classNames from 'classnames';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import Header from '../components/Header';
import Search from '../components/Search';
import Button from '../components/Button';
import SongList from '../components/SongList';
import ArtistView from '../components/ArtistView';
import AlbumView from '../components/AlbumView';
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
      results: [],
      recTracks: [],
      genres: [],
      seedItems: [],
      query: '',
      playlistName: '',
      err: ''
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
      console.log(res.data)
    })
    .catch(err => {
      this.setState({ err : err.toString() });
    });
  }

  handleQueryChange = e => {
    this.setState({ query: e.target.value })
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

  handleSubmitRec = e => {
    e.preventDefault();
    let trackIds = this.state.seedTracks.map(track => track.id);
    axios.post('/queries/recommend', { seedTracks: trackIds }, { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
    .then(res => {
      this.setState({
        displayRecs: true,
        currentTab: 'Songs',
        recTracks: res.data
      })
    })
    .catch(err => {
      this.setState({ err : err.toString() });
    })
  }

  setPlayListName = e => this.setState({ playlistName : e.target.value });

  savePlaylists = () => {
    let { playlistName, songResults } = this.state;
    songResults = songResults.map(track => track.uri);
    axios.post('/user/create-playlist', { playlistName, playlistTrackUris : songResults }, { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
    .then(res => {
      console.log(res);
      alert('Playlist saved!');
    })
    .catch(err => {
      this.setState({ err : err.toString() });
    })
  }

  render() {
    const { data, location } = this.props;
    const { currentTab, results, displayRecs, recTracks, seedTracks, seedArtists, seedGenres } = this.state;
    const { username } = data;
    const {
      currentTab,
      currentAlbum,
      songResults,
      albumResults,
      artistResults,
      displayRecs,
      recTracks,
      seedItems,
      err
    } = this.state;

    const songTabStyles = classNames('tab', { 'active': currentTab === 'Songs' })
    const artistTabStyles = classNames('tab', { 'active': currentTab === 'Artists' })
    const genreTabStyles = classNames('tab', { 'active': currentTab === 'Genres' })
    const albumTabStyles = classNames('tab', { 'active': currentTab === 'Albums' })

    const showRecs = (recTracks.length > 0 && displayRecs);
    const seedTracksDisplay = seedTracks.map((track, i) => {
      return (
        <MediaListItem name={track.name} primaryContext={track.artists[0].name} coverArtUrl={track.album.images[0].url} />
      )
    })

    const tabs = ['Songs', 'Artists', 'Genres', 'Albums'];

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
            { !!seedItems.length && (
              <div className="playlist-container">
                <Input onChange={this.setPlayListName} placeholder="my playlist..."></Input>
                <Button onClick={() => this.savePlaylists()}> Save Playlists </Button>
              </div>
            )}
          </div>

          <div className="content">
            <div className="tabs">
              <h1> { !!err.length ? err: '' } </h1>
              <Tabs selectedIndex={tabs.indexOf(currentTab)}>
                <TabList className="browse-headers">
                  <Tab onClick={() => this.setState({ currentTab: 'Songs' })} className={songTabStyles}> Songs </Tab>
                  <Tab onClick={() => this.setState({ currentTab: 'Artists' })} className={artistTabStyles}> Artists </Tab>
                  <Tab onClick={() => this.setState({ currentTab: 'Genres' })} className={genreTabStyles}> Genres </Tab>
                  <Tab onClick={() => this.setState({ currentTab: 'Albums' })} className={albumTabStyles}> Albums </Tab>
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
                  </>) : songResults.length > 0 ? (<>
                    <h2> {currentAlbum} </h2>
                    <SongList handleClick={this.handleSeedClick} songs={songResults} />
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
                  <BrowseView handleClick={this.handleSeedClick} />
                </TabPanel>
                <TabPanel>
                  <h2> Albums </h2>
                  <Search
                    handleChange={this.handleQueryChange}
                    handleQuery={this.handleQuery}
                  />
                  { showRecs ? (<>
                    <h2> Recommendations </h2>
                    <SongList songs={recTracks} />
                  </>) : albumResults.length > 0 ? (
                    <AlbumView handleClick={this.handleAlbumClick} albums={albumResults} />
                  ) : (
                    <p> Nothing to see here... </p>
                  )}
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
