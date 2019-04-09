import React, { Component } from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import MediaQuery from 'react-responsive';
import Button from "../components/Button";
import '../styles/Home.css';

class Home extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    console.log(this.props.data)
  }

  render() {
    const { data, location } = this.props;
    const { username } = data;
    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            <p> Profile </p>
            <MediaQuery query="(min-width: 768px)">
              <img className="avatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg" />
            </MediaQuery>
          </div>
          <div className="content">
            <Search />
          </div>
          { <Button onClick={(e) =>   {
              e.preventDefault();
              Cookies.remove("cookie");
              this.setState({loadingDone: true,redirect: "/login"});
            }}>log out</Button> }
          { <Button onClick={(e) =>   {
              e.preventDefault();
              this.setState({loadingDone: true,redirect: "/UserProfile"});
            }}>User Profile</Button>}
        </div>
      </main>
    )
  }
}

export default Home;
