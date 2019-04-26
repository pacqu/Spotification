import React, { Component } from "react";
import classNames from 'classnames';

import Header from '../components/Header';
import Chart from '../components/Chart';
import UserDetails from '../components/UserDetails';
import HorizontalBarGraph from '../components/HorizontalBarGraph';

import { ListGroup, ListGroupItem } from "shards-react";

import '../styles/Profile.css';

class Profile extends Component {
	constructor(props){
    super(props);
  }
  
  SongList = (topSongs) => {
    let songs = topSongs.slice(0,10).map((item =>
      <ListGroupItem>{`${item[0]} - ${item[1]}`}</ListGroupItem>
    ))
    return (
      <ListGroup>
        {songs}
      </ListGroup>
    )
  }
	
  componentDidMount(){
	}
	
  render() {
    const { data, location } = this.props;
    const { username, listeningData } = data;
    const topSongs = Object.entries(listeningData.songs).map(item => [item[1].artists.name, item[1].name]);
    const { sortedGenres } = listeningData;
    const barData = sortedGenres.map(g => [g.genre, g.count]).slice(0, 7);
    return (
      <main>
        <Header name={username} location={location} logout={this.handleLogout}/>
        <div className="home-container">
          <div className="sidebar">
            <UserDetails className="user-details" />
          </div>
          <div className="content">
            <Chart title="My Top Songs" className="chart">
              {this.SongList(topSongs)}
              {/* {this.BarGraph()} */}
            </Chart>
            <Chart title="Favorite Genres" className="chart">
              <HorizontalBarGraph label={"Count"} barData={barData} />
            </Chart>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile;
