import React, { Component } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import '../styles/Home.css';
import '../styles/Layout.css';
import axios from 'axios';
import Cookies from "js-cookie";
import MediaQuery from 'react-responsive';
import GenreImg from '../components/GenreImg'
import { generateKeyPair } from 'crypto';
import defaultAvatar from '../static/default.png';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      time: '',
      stuff: []
    }
  }

  componentDidMount(){
    axios.get('/queries',  { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res =>{
      this.setState({
        data: res.data.slice(0,20), //limited to latest 20 queries
      })
      console.log(res.data)
    })
  }

  display = () => (
    this.state.data.map((item => {
      let trackImg = this.getUrl(item)
      let songNames = [], artistNames = [], genreNames =[];
      let userAvatar = defaultAvatar;
      if (item.userImages != null && item.userImages.length > 0 && item.userImages[0].url ) userAvatar = item.userImages[0].url
      if(item.reqBody.tracks != undefined){
        songNames = item.reqBody.tracks.map((item => item.artists[0].name + " - " + item.name))
      }
      if(item.reqBody.artists != undefined){
        artistNames = item.reqBody.artists.map((item => item.name))
      }
      if(item.reqBody.seedGenres != undefined){
        genreNames =  item.reqBody.seedGenres.map(item => item)
      }
      return (
        <Card
          genre={genreNames}
          artists={artistNames}
          song={songNames}
          user={item.username}
          userAvatar={userAvatar}
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
    let trackUrl = [], artistUrl = [], genreUrl =[];
    if(item.reqBody.tracks != undefined){
      trackUrl = item.reqBody.tracks.map((item => item.album.images[1].url)).filter(item => item !=undefined)
    }
    if(item.reqBody.artists != undefined){
      artistUrl = item.reqBody.artists.map(item => item.images[0]).map(item => item ? item.url :'http://chittagongit.com/images/no-picture-available-icon/no-picture-available-icon-6.jpg')
    }
    if(item.reqBody.seedGenres != undefined){
      genreUrl = item.reqBody.seedGenres.map(item => item)
    }
    return trackUrl.concat(artistUrl).concat(GenreImg(genreUrl)).slice(0,3)
  }

  thyme = (item) => {
    let date = item.timeOfQuery;
    //if (date[date.length - 1] == 'Z') date = date.substring(0,date.length - 1)
    var d = new Date(date);
    console.log(d);
    let pm = false
    let minutes = d.getMinutes();
    let hour = d.getHours();
    if (hour >= 12) pm = true;
    if (hour > 12) hour = hour % 12;
    if (hour == 0) hour = 12;
    if (minutes < 10) minutes = '0' + minutes;
    return `${hour}:${minutes} ${pm ? 'PM' : 'AM'}`
    /*
    let catchHalf = item.timeOfQuery.substring(11,13) > 12 ? // figures out AM or PM
      ((item.timeOfQuery.substring(11,13))-12 + item.timeOfQuery.substring(13,16)+ ' ' +'PM') :
      (item.timeOfQuery.substring(11,16) + ' ' +'AM')
    let catchNoon = catchHalf.substring(0,2) == 12 ? (catchHalf.substring(0,5) + ' ' + 'PM') : (catchHalf)
    let catchMidnight = catchNoon.substring(0,2) == 0 ? ('12' + catchNoon.substring(2,5) + ' ' + 'AM') : (catchNoon)
    let catchZero = catchMidnight[0] == 0 ?(catchMidnight.substring(1)) : catchMidnight // takes out 0 -> 03:21 -> 3:21
    return catchZero;*/
  }

  render() {
    const { data, location } = this.props;
    const { username, images } = data;
    let avatarImg = "https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg";
    if (images != null && images.length > 0 && images[0].url) avatarImg = images[0].url;
    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            <MediaQuery query="(min-width: 768px)">
              <img className="avatar" src={avatarImg} />
            </MediaQuery>
            <h1>{username}</h1>
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
