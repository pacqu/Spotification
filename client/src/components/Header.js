import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import logo from '../static/logo.svg';
import { slide as Menu } from 'react-burger-menu';
import '../styles/Burger.css';
import '../styles/Header.css';

import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false
    }
  }
  handleLogout = (e) => {
    e.preventDefault();
    Cookies.remove('cookie');
    this.setState({ logout: true })
  }
  render() {
    const { className, name, location, logout } = this.props;
    const locations = ['Logout', 'Profile', 'Home', 'Data', 'Recommendation'];
    const navItems = locations.map(item => {
      let href = `/${item}`
      if (location.toLowerCase().includes(item.toLowerCase())) {
        return (<a href={href} key={item} className="menu-item"> {item} </a>)
      } else if (item.includes('Logout')) {
        return (<a key={item} className="menu-item disabled" onClick={this.handleLogout}> Logout </a>)
      } else {
        return (<a key={item} href={href} className="menu-item disabled"> {item} </a>)
      }
    })
    const headerStyles = classNames(className, 'nav');
    if (this.state.logout) return (<Redirect to='/login' />)
    return (
      <nav className={headerStyles} id="page-wrap">
        <img className="logo" src={logo} alt=""/>
        <MediaQuery query="(max-width: 767px)">
          <div className="menu-item-container">
            <Menu className="burger-nav" pageWrapId={"page-wrap"} outerContainerId={"App"}>
              {navItems}
            </Menu>
            <img className="nav-image" src="https://res.cloudinary.com/practicaldev/image/fetch/s--eCDHwwsl--/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/134952/defd1b30-a717-4a8b-b44a-2d894ad1b97d.png" />
            <a href="/Account" className="menu-item"> Welcome, {name}! </a>
          </div>
        </MediaQuery>
        <MediaQuery query="(min-width: 768px)">
          <div className="menu-item-container">
            {navItems}
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