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
    axios.get(`/search?search=${this.state.query}&searchType=${tabState}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      let data = res.data[resultsType].items;
      data = data.map(item => item.type = tabState);
      if (res.data[resultsType].items) {
        this.setState({ [stateType]: res.data[resultsType].items, displayRecs: false })
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
    /*
    axios.get(`search/artist/${artist.id}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      //let artistSongs = res.data.items.map(song => Object.assign({}, song, { album : { name : album.name, images: [ album.images[0] ] } } ))
      this.setState({
        songResults: [],
        currentTab: 'Songs'
      })
    })
    .catch(err => {
      this.setState({ err : err.toString() });
    })*/
  }

  handleAlbumClick = album => {
    console.log(album);
    this.setState({simItem: album})
    /*
    axios.get(`search/album/${album.id}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      console.log(res)
      let albumSongs = res.data.items.map(song => Object.assign({}, song, { album : { name : album.name, images: [ album.images[0] ] } } ))
      this.setState({
        songResults: albumSongs,
        currentTab: 'Songs'
      })
    })
    .catch(err => {
      this.setState({ err : err.toString() });
    })*/
  }

  handleSongClick = (song) => {
    console.log(song)
    this.setState({simItem: song})
  }

  removeFromSim() {
    this.setState({ simItem : null });
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
      displayRecs,
      recTracks,
      simItem,
      err
    } = this.state;

    const songTabStyles = classNames('tab', { 'active': currentTab === 'Songs' })
    const artistTabStyles = classNames('tab', { 'active': currentTab === 'Artists' })
    const genreTabStyles = classNames('tab', { 'active': currentTab === 'Genres' })
    const albumTabStyles = classNames('tab', { 'active': currentTab === 'Albums' })

    const showRecs = (recTracks.length > 0 && displayRecs);

    let simItemDisplay = null;
    if (simItem){
      if (simItem.type === 'track') {
        simItemDisplay = <SimilarityItem onClick={() => this.removeFromSim()} id={simItem.id} type={simItem.type} name={simItem.name} primaryContext={simItem.artists[0].name} coverArtUrl={simItem.album.images[0].url ? simItem.album.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      } else if (simItem.type === 'artist') {
        simItemDisplay = <SimilarityItem onClick={() => this.removeFromSim()} id={simItem.id} type={simItem.type} name={simItem.name} primaryContext={simItem.genres[0] ? simItem.genres[0] : ""} coverArtUrl={simItem.images[0].url ? simItem.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      } else if (simItem.type === 'album') {
        simItemDisplay = <SimilarityItem onClick={() => this.removeFromSim()} id={simItem.id} type={simItem.type} name={simItem.name} primaryContext={simItem.artists[0].name} coverArtUrl={simItem.images[0].url ? simItem.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      }
    }

    const tabs = ['Songs', 'Artists', 'Albums'];

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
                </TabList>
                <TabPanel>
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
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default SimilarityScores;
