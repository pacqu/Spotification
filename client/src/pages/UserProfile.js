import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import MediaQuery from 'react-responsive';
import '../styles/Home.css';
import { Bar } from 'react-chartjs-2';

class UserProfile extends Component {
	constructor(props){
    super(props);
    this.state = {
      loadingDone: false,
			name: "",
			features: [],
			featuresName: [],
			featuresValue: []
		}
		this.spotifyData = this.spotifyData.bind(this);
	}
// Object.entries(res.data[0].listeningData.avgFeatures) -> for each loops thru data
// Object.entries(res.data[0].listeningData.avgFeatures).filter(item=> item[0] !=="duration_ms") -> filter out ms for now
// Remove .filter(item=> item[0] !=="duration_ms") when graph options fixed.
  spotifyData = () =>{
		axios
			.get("/user/listening-data", { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
			.then(res=>{
				let array = Object.entries(res.data[0].listeningData.avgFeatures).filter(item=> item[0] !=="duration_ms")
				this.setState({
					features: array,
					featuresName: array.map((item) => item[0]),
					featuresValue: array.map((item) => item[1])
				})
			})
	}	

	BarGraph = (props) => {
		const data = {
			labels: this.state.featuresName,
			datasets: [
				{
					label: "My First dataset",
					fillColor: "rgba(220,220,220,0.2)",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: this.state.featuresValue
				}
			]
		}
		return (
			<Bar data={data}/>
		)
	}
	
  componentDidMount(){
    this.setState({loadingDone: true})
    if (Cookies.get('cookie')){
      axios.get('/user/', { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })
      .then(res => {
				console.log(res)
        console.log(!(res.data[0].spotifyAuth))
        if(!(res.data[0].spotifyAuth)){
          this.setState({loadingDone: true, redirect: "/login"})
        }
        else{
					this.setState({
						loadingDone: true,
						name: res.data[0].username,
					})
					this.spotifyData();
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
		const { name } = this.state;
    if (this.state.loadingDone){
      if (this.state.redirect) return <Redirect to={this.state.redirect} />
      return (
        <div className="home-container">
          <Header name={name} location="Home"/>
          <div className="sidebar">
            this is the sidebar
            <MediaQuery query="(min-width: 768px)">
              <img className="avatar" src="https://i.kym-cdn.com/entries/icons/mobile/000/028/861/cover3.jpg" />
            </MediaQuery>
          </div>
          <div className="content">
						{this.BarGraph()}
					</div>
				</div>
      )
    }
    else return <div>Loading!</div>
		}
	}

export default UserProfile;

