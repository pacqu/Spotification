import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import '../styles/Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const { name, location } = this.props;
    return (
      <div className="header">
        <div className="item logo"> Spotification </div>
        <div className="item account"> {name} </div>
        <MediaQuery query="(max-width: 767px)">
          <ul className="burger-nav">
            <li href="/">Home</li>
            <li href="/account">My Acccount</li>
            <li>Log Out</li>
          </ul>
        </MediaQuery>
        <MediaQuery query="(min-width: 768px)">
        <></>
        </MediaQuery>
      </div>
    )
  }
}

Header.propTypes = {
  name     : PropTypes.string,
  location : PropTypes.string
}

Header.defaultProps = {
  name     : 'Justin',
  location : 'Home'
}

export default Header;