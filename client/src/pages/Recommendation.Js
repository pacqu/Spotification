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
      currentAlbum: '',
      songResults: [],
      artistResults: [],
      albumResults: [],
      recTracks: [],
      genres: [],
      seedItems: [],
      query: '',
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

  handleAlbumClick = album => {
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
    })
  }

  handleSeedClick = (seedItem) => {
    let { seedItems } = this.state;
    if (seedItems.length > 4) {
      alert('Please don\'t add more than 5 seeds!');
    } else {
      seedItems.push(seedItem);
      this.setState({ seedItems });
    }
  }

  removeGenreFromSeeds(name) {
    let { seedItems } = this.state;
    seedItems = seedItems.filter(seedItem  => seedItem.name != name);
    this.setState({ seedItems })
  }

  removeFromSeeds(id) {
    let { seedItems } = this.state;
    seedItems = seedItems.filter(seedItem  => seedItem.id != id);
    this.setState({ seedItems });
  }

  handleSubmitRec = (e) => {
    e.preventDefault();
    let { seedItems } = this.state;
    let seedTracks = seedItems.filter(item => item.type === 'track').map(track => track.id);
    let seedArtists = seedItems.filter(item => item.type === 'artist').map(artist => artist.id);
    let seedGenres = seedItems.filter(item => item.type === 'genre').map(genre => genre.name.toLowerCase());
    axios.post('/queries/recommend', { seedTracks, seedArtists, seedGenres }, { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
    .then(res => {
      this.setState({
        displayRecs: true,
        currentTab: 'Songs',
        recTracks: res.data
      })
    })
    .catch(err => {
      console.log(err)
      this.setState({ err : err.toString() });
    })
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
      seedItems,
      err
    } = this.state;

    const songTabStyles = classNames('tab', { 'active': currentTab === 'Songs' })
    const artistTabStyles = classNames('tab', { 'active': currentTab === 'Artists' })
    const genreTabStyles = classNames('tab', { 'active': currentTab === 'Genres' })
    const albumTabStyles = classNames('tab', { 'active': currentTab === 'Albums' })

    const showRecs = (recTracks.length > 0 && displayRecs);

    const seedItemsDisplay = seedItems.map((seedItem, i) => {
      if (seedItem.type === 'track') {
        return <MediaListItem onClick={() => this.removeFromSeeds(seedItem.id)} name={seedItem.name} primaryContext={seedItem.artists[0].name} coverArtUrl={seedItem.album.images[0].url ? seedItem.album.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      } else if (seedItem.type === 'artist') {
        return <MediaListItem onClick={() => this.removeFromSeeds(seedItem.id)} name={seedItem.name} coverArtUrl={seedItem.images[0] ? seedItem.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>
      } else if (seedItem.type === 'album') {
        return <MediaListItem onClick={() => this.removeFromSeeds(seedItem.id)} name={seedItem.name} coverArtUrl={seedItem.images[0] ? seedItem.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg' }/>
      } else if (seedItem.type === 'genre') {
        return <MediaListItem onClick={() => this.removeGenreFromSeeds(seedItem.name)} name={seedItem.name} coverArtUrl={seedItem.imageUrl ? seedItem.imageUrl : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg' }/>
      }
    })

    const tabs = ['Songs', 'Artists', 'Genres', 'Albums'];

    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            <p>Currently Selected ({seedItemsDisplay.length > 0})</p>
            { seedItems.length > 0 && (<>
              { seedItemsDisplay }
            </>)}
            { seedItems.length > 0 && (<>
              <Button onClick={(e) => this.handleSubmitRec(e)}>Get Recs</Button>
            </>)}
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
                  { showRecs ? (<>
                    <h2> Recommendations </h2>
                    <SongList songs={recTracks} />
                  </>) : songResults.length > 0 ? (<>
                    <h2> {currentAlbum} </h2>
                    <SongList handleClick={this.handleSeedClick} songs={songResults} />
                  </>) : (
                    <p> Nothing to see here... </p>
                  )}
                </TabPanel>
                <TabPanel>
                  <Search
                    handleChange={this.handleQueryChange}
                    handleQuery={this.handleQuery}
                  />
                  { showRecs ? (<>
                    <h2> Recommendations </h2>
                    <Button onClick={() => this.setState({ showRecs : !showRecs })}> Go Back </Button>
                    <SongList songs={recTracks} />
                  </>) : artistResults.length > 0 ? (
                    <ArtistView handleClick={this.handleSeedClick} artists={artistResults}/>
                  ) : (
                    <p> Nothing to see here... </p>
                  )}
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
