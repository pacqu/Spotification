import React, { Component } from "react";
import classNames from 'classnames';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import HorizontalBarGraph from '../components/HorizontalBarGraph';
import DoubleBarGraph from '../components/DoubleBarGraph';
import RadarGraph from '../components/RadarGraph';
import Header from '../components/Header';
import Search from '../components/Search';
import Button from '../components/Button';
import SongList from '../components/SongList';
import ArtistView from '../components/ArtistView';
import AlbumView from '../components/AlbumView';
import BrowseView from '../components/BrowseView';
import MediaListItem from '../components/MediaListItem';
import MediaQuery from 'react-responsive';

import Chart from '../components/Chart';
import axios from "axios";
import Cookies from "js-cookie";

import '../styles/Recommendation.css';
import '../styles/Layout.css';

class DataVisualizations extends Component {
	constructor(props){
    super(props);
		this.state = {
      displayRecs: false,
			currentTab: 'Songs',
      seedTracks: [],
			currentAlbum: '',
      artistResults: [],
      albumResults: [],
			results: [],
      recTracks: [],
			bar1FeaturesName:[],
			bar1FeaturesValue:[],
			bar2FeaturesName:[],
			bar2FeaturesValue:[],
			radarFeaturesName: [],
			radarFeaturesValue:[],
			selectedbar1FeaturesValue: [],
			selectedbar2FeaturesValue: [],
			selectedradarFeaturesValue: [],
			spotifybar1FeaturesValue: [],
			spotifybar2FeaturesValue:[],
			spotifyradarFeaturesValue:[],
			userFeaturesName: [],
			userFeaturesValue: [],
    }
	}

	componentDidMount(){
		const { data }  = this.props;
		if (!(data.listeningData)) this.spotifyData();
    else {
      let array = Object.entries(
        data.listeningData.avgFeatures
      ).filter(item => item[0] !== "duration_ms");
			//Filtering for first bar graph
			let bar1array = Object.entries(
	       data.listeningData.avgFeatures
	     ).filter(item =>
				item[0] !== "duration_ms"
				&& item[0] !== "mode"
				&& item[0] !== "acousticness"
				&& item[0] !== "danceability"
				&& item[0] !== "energy"
				&& item[0] !== "liveness"
				&& item[0] !== "valence"
				&& item[0] !== "instrumentalness"
				&& item[0] !== "speechiness");
				//Filtering for radar
			let radarArray = Object.entries(
				data.listeningData.avgFeatures
			).filter(item =>
				item[0] !== "duration_ms"
				&& item[0] !== "key"
				&& item[0] !== "mode"
				&& item[0] !== "time_signature"
				&& item[0] !== "instrumentalness"
				&& item[0] !== "loudness"
				&& item[0] !== "speechiness"
				&& item[0] !== "popularity"
				&& item[0] !== "tempo");
				//Filtering for second bar graph (horizontal bar graph)
			let bar2array = Object.entries(
	       data.listeningData.avgFeatures
	     ).filter(item =>
				item[0] !== "duration_ms"
				&& item[0] !== "key"
				&& item[0] !== "mode"
				&& item[0] !== "time_signature"
				&& item[0] !== "acousticness"
				&& item[0] !== "danceability"
				&& item[0] !== "energy"
				&& item[0] !== "liveness"
				&& item[0] !== "valence"
				&& item[0] !== "loudness"
				&& item[0] !== "popularity"
				&& item[0] !== "tempo");
      this.setState({
				bar1FeaturesName: bar1array.map(item => item[0]),
        bar1FeaturesValue: bar1array.map(item => item[1]),
				bar2FeaturesName: bar2array.map(item => item[0]),
        bar2FeaturesValue: bar2array.map(item => item[1]),
				radarFeaturesName: radarArray.map(item => item[0]),
				radarFeaturesValue: radarArray.map(item => item[1]),
        loadingDone: true
      });
      //console.log(Object.entries(data));
    }
	}

	handleQuery = e => {
		e.preventDefault();
		let tabState = 'track', resultsType = 'tracks', stateType = 'results';
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
			if(resultsType !== 'tracks'){
				data = res.data[resultsType].items.filter(item => item.images.length != 0);
			}
			if (data) {
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

	handleSeedClick = seed => {
		let tabState = 'artist', dataState= 'tracks';
		if (this.state.currentTab === 'Albums') {
			tabState = 'album'
			dataState = 'items';
		}
		axios.get(`search/${tabState}/${seed.id}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
		.then(res => {
			console.log(res)
			let seedSongs = res.data[dataState].map(song => Object.assign({}, song, { album : { name : seed.name, images: [ seed.images[0] ] } } ))
			this.setState({
				displayRecs: false,
				results: seedSongs,
				currentTab: 'Songs'
			})
		})
		.catch(err => {
			this.setState({ err : err.toString() });
		})
	}

	handleSongClick = (song) => {
    let { seedTracks } = this.state;
    if (seedTracks.length > 9) {
      alert('Please don\'t add more than 10 songs!');
    } else {
      seedTracks.push(song);
      this.setState({ seedTracks });
    }
  }

	handleShowSpotifyData = (e) => {
		e.preventDefault();
		this.setState({
			currentTab: 'Spotify'
		})
		axios.post('/queries/visual',
		{ visualType: 'top'},
		{ headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
		.then(res => {
			let bar1array = Object.entries(
	       res.data.avgFeatures
	     ).filter(item =>
				item[0] !== "duration_ms"
				&& item[0] !== "mode"
				&& item[0] !== "acousticness"
				&& item[0] !== "danceability"
				&& item[0] !== "energy"
				&& item[0] !== "liveness"
				&& item[0] !== "valence"
				&& item[0] !== "instrumentalness"
				&& item[0] !== "speechiness");
			let radarArray = Object.entries(
				res.data.avgFeatures
				).filter(item =>
				item[0] !== "duration_ms"
				&& item[0] !== "key"
				&& item[0] !== "mode"
				&& item[0] !== "time_signature"
				&& item[0] !== "instrumentalness"
				&& item[0] !== "loudness"
				&& item[0] !== "speechiness"
				&& item[0] !== "popularity"
				&& item[0] !== "tempo");
				//Filtering for second bar graph
				let bar2array = Object.entries(
		       res.data.avgFeatures
		     ).filter(item =>
					item[0] !== "duration_ms"
					&& item[0] !== "key"
					&& item[0] !== "mode"
					&& item[0] !== "time_signature"
					&& item[0] !== "acousticness"
					&& item[0] !== "danceability"
					&& item[0] !== "energy"
					&& item[0] !== "liveness"
					&& item[0] !== "valence"
					&& item[0] !== "loudness"
					&& item[0] !== "popularity"
					&& item[0] !== "tempo");
			this.setState({
				spotifybar1FeaturesValue: bar1array.map(item => item[1]),
				spotifyradarFeaturesValue: radarArray.map(item => item[1]),
				spotifybar2FeaturesValue: bar2array.map(item => item[1])
			})
		})
		.catch(err => {
			console.log(err);
		})
	}

	removeFromSeeds(id) {
		let { seedTracks } = this.state;
		seedTracks = seedTracks.filter(seedTracks  => seedTracks.id != id);
		this.setState({ seedTracks });
	}

	handleSubmitData = (e) => {
    e.preventDefault();
    let trackIds = this.state.seedTracks.map(track => track.id);
    axios.post('/queries/visual',
		{ visualType: 'selected', selectedTracks: trackIds},
    { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
    .then(res => {
			let array = Object.entries(
        res.data.avgFeatures
      ).filter(item => item[0] !== "duration_ms");
			let bar1array = Object.entries(
	       res.data.avgFeatures
	     ).filter(item =>
				item[0] !== "duration_ms"
				&& item[0] !== "mode"
				&& item[0] !== "acousticness"
				&& item[0] !== "danceability"
				&& item[0] !== "energy"
				&& item[0] !== "liveness"
				&& item[0] !== "valence"
				&& item[0] !== "instrumentalness"
				&& item[0] !== "speechiness");
			let radarArray = Object.entries(
				res.data.avgFeatures
				).filter(item =>
				item[0] !== "duration_ms"
				&& item[0] !== "key"
				&& item[0] !== "mode"
				&& item[0] !== "time_signature"
				&& item[0] !== "instrumentalness"
				&& item[0] !== "loudness"
				&& item[0] !== "speechiness"
				&& item[0] !== "popularity"
				&& item[0] !== "tempo");
				//Filtering for second bar graph
				let bar2array = Object.entries(
		       res.data.avgFeatures
		     ).filter(item =>
					item[0] !== "duration_ms"
					&& item[0] !== "key"
					&& item[0] !== "mode"
					&& item[0] !== "time_signature"
					&& item[0] !== "acousticness"
					&& item[0] !== "danceability"
					&& item[0] !== "energy"
					&& item[0] !== "liveness"
					&& item[0] !== "valence"
					&& item[0] !== "loudness"
					&& item[0] !== "popularity"
					&& item[0] !== "tempo");
      this.setState({
        displayRecs: true,
				recTracks: res.data,
				selectedbar1FeaturesValue: bar1array.map(item => item[1]),
				selectedradarFeaturesValue: radarArray.map(item => item[1]),
				selectedbar2FeaturesValue: bar2array.map(item => item[1])
      })
			console.log(this.state.selectedbar2FeaturesValue);
    })
    .catch(err => {
      console.log(err);
    })
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
        userFeaturesName: array.map(item => item[0]),
        userFeaturesValue: array.map(item => item[1]),
        topSongs: Object.entries(res.data[0].listeningData.songs).map(
          item => item[1].name
        ),
        loadingDone: true
      });
    });
  };

  render() {
    const { data, location } = this.props;
		const { currentTab, results, displayRecs, recTracks, seedTracks,currentAlbum,
		albumResults,
		artistResults, } = this.state;
    const { username } = data;

		const songTabStyles = classNames('tab', { 'active': currentTab === 'Songs' })
		const spotifyTabStyles = classNames('tab', { 'active': currentTab === 'Spotify' })
		const artistTabStyles = classNames('tab', { 'active': currentTab === 'Artists' })
		const albumTabStyles = classNames('tab', { 'active': currentTab === 'Albums' })

		const showRecs = (recTracks.length > 0 && displayRecs);
		const seedTracksDisplay = seedTracks.map((seedTrack, i) => {
			return (<MediaListItem onClick={() => this.removeFromSeeds(seedTrack.id)} name={seedTrack.name} primaryContext={seedTrack.artists[0].name} coverArtUrl={seedTrack.album.images[0].url ? seedTrack.album.images[0].url : 'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg'}/>)
		})

		const tabs = ['Songs', 'Artists', 'Albums', 'Spotify'];

    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
					<p>Currently Selected ({seedTracks.length})</p>
					{ seedTracks.length > 0 && (<>
						{ seedTracksDisplay }
						<Button onClick={(e) => this.handleSubmitData(e)}>Get Visualizations</Button>
					</>)}
          </div>
          <div className="content">
					<div className="tabs">
						<Tabs selectedIndex={tabs.indexOf(currentTab)}>
						<TabList className="browse-headers">
							<Tab onClick={() => this.setState({ currentTab: 'Songs' })} className={songTabStyles}> Songs </Tab>
							<Tab onClick={() => this.setState({ currentTab: 'Artists' })} className={artistTabStyles}> Artists </Tab>
							<Tab onClick={() => this.setState({ currentTab: 'Albums' })} className={albumTabStyles}> Albums </Tab>
							<Tab onClick={(e) => this.handleShowSpotifyData(e)} className={spotifyTabStyles}> Spotify Data </Tab>
						</TabList>
						<TabPanel>
						{displayRecs ? (
							<div className="content">
							<Chart title="Musical Elements">
									<DoubleBarGraph
										labels={this.state.bar1FeaturesName}
										barData1={this.state.bar1FeaturesValue}
										label1={"My Songs"}
										barData2={this.state.selectedbar1FeaturesValue}
										label2={"Selected Songs"}
									/>
							</Chart>
							<Chart title = "Song Attributes">
								<RadarGraph
									labels={this.state.radarFeaturesName}
									barData1={this.state.radarFeaturesValue}
									label1={"My Songs"}
									barData2={this.state.selectedradarFeaturesValue}
									label2={"Selected Songs"}
								/>
							</Chart>
							<Chart title = "Vocals vs Instrumentals">
								<HorizontalBarGraph
									labels={this.state.bar2FeaturesName}
									barData1={this.state.bar2FeaturesValue}
									label1={"My Songs"}
									barData2={this.state.selectedbar2FeaturesValue}
									label2={"Selected Songs"}
								/>
							</Chart>
							</div>
						) : (
							<div className="content">
								<Search
									handleChange={this.handleQueryChange}
									handleQuery={this.handleQuery}
								/>
								{ results.length > 0 ? "" : ( <p> Select up to 10 tracks</p>)}
								{ showRecs ? (<>
									<h2> Recommendations </h2>
									<SongList songs={recTracks} />
								</>) : (
									<SongList handleClick={this.handleSongClick} songs={results} />
								)}
							</div>
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
							<h2> Albums </h2>
							<Search
								handleChange={this.handleQueryChange}
								handleQuery={this.handleQuery}
							/>
							{ showRecs ? (<>
								<h2> Recommendations </h2>
								<SongList songs={recTracks} />
							</>) : albumResults.length > 0 ? (
								<AlbumView handleClick={this.handleSeedClick} albums={albumResults} />
							) : (
								<p> Nothing to see here... </p>
							)}
						</TabPanel>
						<TabPanel>
							<p>Compare your Listening Patterns to The Most Popular Songs on Spotify</p>
							<Chart title="Musical Elements">
								<div className="content">
									<DoubleBarGraph
										labels={this.state.bar1FeaturesName}
										barData1={this.state.bar1FeaturesValue}
										label1={"My Songs"}
										barData2={this.state.spotifybar1FeaturesValue}
										label2={"Spotify Songs"}
									/>
								</div>
							</Chart>
							<Chart title = "Song Attributes">
								<RadarGraph
									labels={this.state.radarFeaturesName}
									barData1={this.state.radarFeaturesValue}
									label1={"My Songs"}
									barData2={this.state.spotifyradarFeaturesValue}
									label2={"Spotify Songs"}
							 	/>
							</Chart>
							<Chart title = "Vocals vs Instrumentals">
								<HorizontalBarGraph
									labels={this.state.bar2FeaturesName}
									barData1={this.state.bar2FeaturesValue}
									label1={"My Songs"}
									barData2={this.state.spotifybar2FeaturesValue}
									label2={"Spotify Songs"}
								/>
							</Chart>
						</TabPanel>
						</Tabs>
						</div>
          </div>
        </div>
      </main>
    )
  }
}


export default DataVisualizations;
