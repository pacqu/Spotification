import React, { Component } from "react";
import Header from '../components/Header';
import MediaQuery from 'react-responsive';
import '../styles/Home.css';

class DataVisualizations extends Component {
	constructor(props){
    super(props);
	}
	
  render() {
    const { data, location } = this.props;
    const { username } = data;
    return (
      <main>
        <Header name={username} location={location} />
        <div className="home-container">
          <div className="sidebar">
            This is the sidebar
            <MediaQuery query="(min-width: 768px)">
              <img className="avatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg" />
            </MediaQuery>
          </div>
          <div className="content">
            <p>stuff</p>
          </div>
        </div>
      </main>
    )
  }
}


export default DataVisualizations;

