import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import ProtectedRoute from './pages/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LnR from './pages/LoginAndRegister'
import Profile from './pages/Profile'
import DataVisualizations from './pages/DataVisualizations'
// import Recommendation from './pages/Recommendation';
import './styles/App.css';

class App extends Component {
  render() {
    return (
      <main className="App" id="App">
        {/* Probably should include a nav bar here */}
        <Router>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/login" component={LnR} />
            <Route path="/home" render={props => <ProtectedRoute component={Home} path="Home" {...props} />} />
            <Route path="/Profile" render={props => <ProtectedRoute component={Profile} path="Profile" {...props} />} />
            <Route path="/Data" render={props => <ProtectedRoute component={DataVisualizations} path="Data" {...props} />} />
            {/* <Route path="/Recommendation" render={props => <ProtectedRoute component={Recommendation} path="Recommendation" path="/Recommendation" {...props} />} /> */}
          </Switch>
        </Router>
      </main>
    );
  }
}

export default App;
