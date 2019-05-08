import React, { Component } from "react";
import classNames from 'classnames';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import Input from '../components/Input';
import Header from '../components/Header';
import Search from '../components/Search';
import Button from '../components/Button';
import SongList from '../components/SongList';
import ArtistView from '../components/ArtistView';
import AlbumView from '../components/AlbumView';
import PlaylistView from '../components/PlaylistView';
import BrowseView from '../components/BrowseView';
import SimilarityItem from '../components/SimilarityItem';

import axios from "axios";
import Cookies from "js-cookie";

import '../styles/Recommendation.css';
import '../styles/Layout.css';

class SimilarityScores extends Component {
	constructor(props){
    super(props);
    this.state = {
      displayRecs: false,
      currentTab: 'Songs',
      currentAlbum: '',
      songResults: [],
      artistResults: [],
      albumResults: [],
      playlistResults: [],
      recTracks: [],
      genres: [],
      simItem: null,
      query: '',
      playlistName: '',
      err: ''
    }
  }

  handleQuery = e => {
    e.preventDefault();
    let tabState = 'track', resultsType = 'tracks', stateType = 'songResults';
    if (this.state.currentTab === 'Artists') {
      tabState = 'artist';
      resultsType = 'artists';
      stateType = 'artistResults';
    } else if (this.state.currentTab === 'Albums') {
      tabState = 'album';
      resultsType = 'albums';
      stateType = 'albumResults';
    }
    else if (this.state.currentTab === 'Playlists') {
      tabState = 'playlist';
      resultsType = 'playlists';
      stateType = 'playlistResults';
    }
    axios.get(`/search?search=${this.state.query}&searchType=${tabState}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      let data = res.data[resultsType].items;
      if(resultsType !== 'tracks'){
        data = res.data[resultsType].items.filter(item => item.images.length != 0);
      }
      if (data) {
        console.log(res.data[resultsType].items)
				this.setState({ [stateType]: data, displayRecs: false })
      }
      console.log(this.state);
    })
    .catch(err => {
      this.setState({ err : err.toString() });
    });
  }

  handleQueryChange = e => {
    this.setState({ query: e.target.value })
  }

  handleArtistClick = artist => {
    console.log(artist);
    this.setState({simItem: artist})
  }

  handleAlbumClick = album => {
    console.log(album);
    this.setState({simItem: album})
  }

  handleSongClick = (song) => {
    console.log(song)
    this.setState({simItem: song})
  }
  handlePlaylistClick = (playlist) => {
    console.log(playlist)
    this.setState({simItem: playlist})
  }

  removeFromSim() {
    this.setState({simItem: null });
  }

  render() {
    const { data, location } = this.props;
    const { username } = data;
    const {
      currentTab,
      currentAlbum,
      songResults,
      albumResults,
      artistResults,
      playlistResults,
      displayRecs,
      recTracks,
      simItem,
      err
    } = this.state;

    const songTabStyles = classNames('tab', { 'active': currentTab === 'Songs' })
    const artistTabStyles = classNames('tab', { 'active': currentTab === 'Artists' })
    const albumTabStyles = classNames('tab', { 'active': currentTab === 'Albums' })
    const playlistTabStyles = classNames('tab', { 'active': currentTab === 'Playlists' })

    const showRecs = (recTracks.length > 0 && displayRecs);

    let simItemDisplay = null;
    if (simItem){
      if (simItem.type === 'track') {
        simItemDisplay = <SimilarityItem onClick={() => this.removeFromSim()} id={simItem.id} type={simItem.type} name={simItem.name} primaryContext={simItem.artists[0].name} coverArtUrl={simItem.album.images[0] ? simItem.album.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      } else if (simItem.type === 'artist') {
        simItemDisplay = <SimilarityItem onClick={() => this.removeFromSim()} id={simItem.id} type={simItem.type} name={simItem.name} primaryContext={simItem.genres[0] ? simItem.genres[0] : ""} coverArtUrl={simItem.images[0] ? simItem.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      } else if (simItem.type === 'album') {
        simItemDisplay = <SimilarityItem onClick={() => this.removeFromSim()} id={simItem.id} type={simItem.type} name={simItem.name} primaryContext={simItem.artists[0].name} coverArtUrl={simItem.images[0] ? simItem.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      }
      else if (simItem.type === 'playlist') {
        simItemDisplay = <SimilarityItem onClick={() => this.removeFromSim()} id={simItem.id} type={simItem.type} name={simItem.name} primaryContext={simItem.owner.display_name} coverArtUrl={simItem.images[0] ? simItem.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      }
    }

    const tabs = ['Songs', 'Artists', 'Albums', 'Playlists'];

    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            <p>Currently Selected </p>
            { simItem && (<>
              { simItemDisplay }
            </>)}
          </div>

          <div className="content">
            <div className="tabs">
              <h1> { !!err.length ? err: '' } </h1>
              <Tabs selectedIndex={tabs.indexOf(currentTab)}>
                <TabList className="browse-headers">
                  <Tab onClick={() => this.setState({ currentTab: 'Songs' })} className={songTabStyles}> Songs </Tab>
                  <Tab onClick={() => this.setState({ currentTab: 'Artists' })} className={artistTabStyles}> Artists </Tab>
                  <Tab onClick={() => this.setState({ currentTab: 'Albums' })} className={albumTabStyles}> Albums </Tab>
                  <Tab onClick={() => this.setState({ currentTab: 'Playlists' })} className={playlistTabStyles}> Playlists </Tab>
                </TabList>
                <TabPanel>
									<h2> Songs </h2>
                  <Search
                    handleChange={this.handleQueryChange}
                    handleQuery={this.handleQuery}
                  />
                  { songResults.length > 0 ? (<>
                    <h2> {currentAlbum} </h2>
                    <SongList handleClick={this.handleSongClick} songs={songResults} />
                  </>) : (
                    <p> Nothing to see here... </p>
                  )}
                </TabPanel>
                <TabPanel>
									<h2> Artists </h2>
                  <Search
                    handleChange={this.handleQueryChange}
                    handleQuery={this.handleQuery}
                  />
                  { artistResults.length > 0 ? (
                    <ArtistView handleClick={this.handleArtistClick} artists={artistResults}/>
                  ) : (
                    <p> Nothing to see here... </p>
                  )}
                </TabPanel>
                <TabPanel>
                  <h2> Albums </h2>
                  <Search
                    handleChange={this.handleQueryChange}
                    handleQuery={this.handleQuery}
                  />
                  { albumResults.length > 0 ? (
                    <AlbumView handleClick={this.handleAlbumClick} albums={albumResults} />
                  ) : (
                    <p> Nothing to see here... </p>
                  )}
                </TabPanel>
                <TabPanel>
                  <h2> Playlists </h2>
                  <Search
                    handleChange={this.handleQueryChange}
                    handleQuery={this.handleQuery}
                  />
                { playlistResults.length > 0 ? (
                    <PlaylistView handleClick={this.handlePlaylistClick} playlists={playlistResults} />
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

export default SimilarityScores;
