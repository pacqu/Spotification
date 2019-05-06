import React, { Component } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import '../styles/Home.css';
import '../styles/Layout.css';
import axios from 'axios';
import Cookies from "js-cookie";
import MediaQuery from 'react-responsive';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      time: ''
    }
  }

  componentDidMount(){
    axios.get('/queries',  { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res =>{
      this.setState({
        data: res.data.slice(0,20) //limited to latest 20 queries
      })
      console.log(res.data)
    })
  }

  display = () => (
    this.state.data.map((item => {
      console.log(item)
    let trackImg = this.getUrl(item)
    let songNames = [], artistNames = [];
    if(item.reqBody.tracks != undefined){
      songNames = item.reqBody.tracks.map((item => item.name + " - " + item.artists[0].name))
    }
    if(item.reqBody.artists != undefined){
      artistNames = item.reqBody.artists.map((item => item.name))
    }
      return (
        <Card 
          artists={artistNames}
          song={songNames}
          user={item.username}
          userAvatar={''}
          queryType={item.queryType}
          trackImg={trackImg}
          time={this.thyme(item)}
          date={
            item.timeOfQuery.substring(6,7) + '/' +
            item.timeOfQuery.substring(8,10) + '/' +
            item.timeOfQuery.substring(2,4)
          }
        >
        </Card>
      )
    }))
  );

  // gets both artists and track url arrays and combine.
  getUrl = (item) => {
    let trackUrl = [], artistUrl = [];
    if(item.reqBody.tracks != undefined){
      trackUrl = item.reqBody.tracks.map((item => item.album.images[1].url)).filter(item => item !=undefined)
    }
    if(item.reqBody.artists != undefined){
      let temp = item.reqBody.artists.map(item => item.images[0]).map(item => item ? item.url :'https://upload.wikimedia.org/wikipedia/en/c/c5/No_album_cover.jpg')      
      artistUrl = temp.map(item => item)
    }
    return trackUrl.concat(artistUrl).slice(0,3)
  }

  thyme = (item) => {
    let catchHalf = item.timeOfQuery.substring(11,13) > 12 ? // figures out AM or PM 
      ((item.timeOfQuery.substring(11,13))-12 + item.timeOfQuery.substring(13,16)+ ' ' +'PM') :
      (item.timeOfQuery.substring(11,16) + ' ' +'AM') 
    let catchNoon = catchHalf.substring(0,2) == 12 ? (catchHalf.substring(0,5) + ' ' + 'PM') : (catchHalf)
    let catchMidnight = catchNoon.substring(0,2) == 0 ? ('12' + catchNoon.substring(2,5) + ' ' + 'AM') : (catchNoon)
    let catchZero = catchMidnight[0] == 0 ?(catchMidnight.substring(1)) : catchMidnight // takes out 0 -> 03:21 -> 3:21
    return catchZero;
  }
  
  handleImage = (e) =>{
    axios.get(`/search/song/${e}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      console.log(res)
    })
  }

  render() {
    const { data, location } = this.props;
    const { username } = data;
    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            <h3>{username}</h3>
            <MediaQuery query="(min-width: 768px)">
              <img className="avatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg" />
            </MediaQuery>
          </div>
          <div className="content">
            {this.display()}
          </div>
        </div>
      </main>
    )
  }
}

export default Home;