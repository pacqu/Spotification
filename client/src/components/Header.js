import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { slide as Menu } from 'react-burger-menu';

import '../styles/Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false
    }
  }
  showSettings(e) {
    e.preventDefault();
  }
  render() {
    const { className, name, location } = this.props;
    const { isHover } = this.state;
    const headerStyles = classNames(className, 'nav');
    return (
      <nav className={headerStyles}>
        {/* <div className="item logo"> Spotification </div> */}
        {/* <div className="item account"> {name} </div> */}
        <MediaQuery query="(max-width: 767px)">
          <Menu>
            <a id="home" className="menu-item-mobile" href="/">Home</a>
            <a id="about" className="menu-item-mobile" href="/about">About</a>
            <a id="contact" className="menu-item-mobile" href="/contact">Contact</a>
            <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a>
          </Menu>
        </MediaQuery>
        <MediaQuery query="(min-width: 768px)">
          <div className="menu-item-container">
            <a href="/Home" className="menu-item"> Home </a>
            <a href="/Account" className="menu-item"> Account </a>
          </div>
        </MediaQuery>
      </nav>
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