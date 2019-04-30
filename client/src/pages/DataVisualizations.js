
import React, { Component } from "react";
import classNames from 'classnames';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import HorizontalBarGraph from '../components/HorizontalBarGraph';
import DoubleBarGraph from '../components/DoubleBarGraph';
import Header from '../components/Header';
import Search from '../components/Search';
import Button from '../components/Button';
import SongList from '../components/SongList';
import ArtistView from '../components/ArtistView';
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
      seedTracks: [],
			results: [],
      recTracks: [],
			selectedFeaturesName: [],
			selectedFeaturesValue: [],
			userFeaturesName: [],
			userFeaturesValue: []
    }
	}

	componentDidMount(){
		const { data }  = this.props;
		if (!(data.listeningData)) this.spotifyData();
    else {
      let array = Object.entries(
        data.listeningData.avgFeatures
      ).filter(item => item[0] !== "duration_ms");
      this.setState({
        userFeaturesName: array.map(item => item[0]),
        userFeaturesValue: array.map(item => item[1]),
        loadingDone: true
      });
      console.log(Object.entries(data));
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
    if (seedTracks.length > 9) {
      alert('Please don\'t add more than 10 songs!');
    } else {
      seedTracks.push(song);
      this.setState({ seedTracks });
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

	handleSubmitData = (e) => {
    e.preventDefault();
    let trackIds = this.state.seedTracks.map(track => track.id);
    console.log(trackIds);
    axios.post('/queries/visual',
		{ visualType: 'selected', selectedTracks: trackIds},
    { headers: { Authorization: `Bearer ${Cookies.get("cookie")}`}})
    .then(res => {
      console.log(res.data);
			console.log(res.data.avgFeatures);
			let array = Object.entries(
        res.data.avgFeatures
      ).filter(item => item[0] !== "duration_ms");
      this.setState({
        displayRecs: true,
				recTracks: res.data,
				selectedFeaturesName: array.map(item => item[0]),
        selectedFeaturesValue: array.map(item => item[1]),
      })
			console.log(this.state.selectedFeaturesName)
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
		const { results, displayRecs, recTracks, seedTracks } = this.state;
    const { username } = data;
		const showRecs = (recTracks.length > 0 && displayRecs);

		const seedTracksDisplay = seedTracks.map((track, i) => {
			return (
				<MediaListItem name={track.name} primaryContext={track.artists[0].name} coverArtUrl={track.album.images[0].url} />
			)
		})

		const seedTrackDisplay = seedTracks.map((track,i) => {
			return(<li data-id={i} onClick={(e) => this.removeFromTracks(e,this.state.seedTracks[i])} >{track.name} by {track.artists[0].name} of {track.album.name}</li>)
		})

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
						{displayRecs ? (
							<Chart title="Song Attributes">
								<div className="content">
									<DoubleBarGraph
										labels={this.state.userFeaturesName}
										barData1={this.state.userFeaturesValue}
										label1={"My Songs"}
										barData2={this.state.selectedFeaturesValue}
										label2={"Selected Songs"}
									/>
								</div>
							</Chart>
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
          </div>
        </div>
      </main>
    )
  }
}


export default DataVisualizations;
