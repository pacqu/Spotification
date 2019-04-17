import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LnR from './pages/LoginAndRegister'
import Profile from './pages/Profile'
import DataVisualizations from './pages/DataVisualizations'
import Recommendation from './pages/Recommendation'
import './styles/App.css';

class App extends Component {
  render() {
    return (
      <main className="App" id="App">
        {/* Probably should include a nav bar here */}
        <Router>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={Home} />
            <Route path="/login" component={LnR} />
            <Route path="/Profile" component={Profile} />
            <Route path="/My Data" component={DataVisualizations} />
            <Route path="/Recommendation" component={Recommendation} />
          </Switch>
        </Router>
      </main>
    );
  }
}

export default App;