import React, { Component } from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import Input from "../components/Input";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
  }

  handleQuery = name => ({ target }) => {
    axios.get(`/search?search=${target.value}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      if (res.data.tracks.items) {
        console.log(res.data.tracks.items)
        this.setState({
          [name]: target.value,
          results: res.data.tracks.items
         })
      }
    })
    .catch(err => {
      console.log(err);
    });
  };

  defaultOnTrackClick(e, tracks){
    if (e.currentTarget.dataset.id) {
      console.log(tracks[e.currentTarget.dataset.id])
      return tracks[e.currentTarget.dataset.id]
    }
    return {};
  }

  componentDidMount() {
    this.setState({loadingDone: true})
    if (Cookies.get('cookie')){
      axios.get('/user/', { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
      .then(res => {
        const { username } = res.data[0]
        if(!(res.data[0].spotifyAuth)){
          this.setState({loadingDone: true, redirect: "/login"})
        }
        else{
          this.setState({loadingDone: true})
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
    else{
      this.setState({loadingDone: true,redirect: "/login"})
    }
  }

  render() {
    let tracks = []
    let onClick = this.props.onTrackClick ? this.props.onTrackClick : this.defaultOnTrackClick
    if (this.state.results !== undefined && this.state.results.length > 0){
      tracks = this.state.results.map((track,i) => {
        return(<li data-id={i} onClick={(e) => onClick(e, this.state.results)}>{track.name} by {track.artists[0].name} of {track.album.name}</li>)
      })
    }
    console.log(tracks)
    return(
      <div>
      <Input
      type="text"
      placeholder="Search"
      onChange={this.handleQuery("query")}
      fullWidth
      />
      <ul>
      {tracks}
      </ul>
      </div>
    )
  }
}

export default Search;
