import React, { Component } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/Search.css';
class Search extends Component {
  constructor(props) {
    super(props);
  }

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.props.handleQuery(e)
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
