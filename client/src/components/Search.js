import React, { Component } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/Search.css';
class Search extends Component {
  constructor(props) {
    super(props);
  }

  handleQuery = name => ({ target }) => {
    if(target.value === ""){
      this.setState({
        [name]: target.value,
        results: []
       })
    }
    else{
    axios.get(`/search?search=${target.value}`, { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
    .then(res => {
      if (res.data.tracks.items) {
        //console.log(res.data.tracks.items)
        this.setState({
          [name]: target.value,
          results: res.data.tracks.items
         })
      }
    })
    .catch(err => {
      console.log(err);
    });
  }
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
    return(
      <div className="search-field">
        <div className="search-input">
          <Input
            type="text"
            placeholder="Search"
            onChange={this.props.handleChange}
            onKeyDown={this.handleKeyDown}
            fullWidth
            search
          />
          <Button
            inverted
            className="search-button"
            onClick={this.props.handleQuery}
          > Search
          </Button>
        </div>
      </div>
    )
  }
}

export default Search;
