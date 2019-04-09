import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import ProtectedRoute from './pages/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LnR from './pages/LoginAndRegister'
import UserProfile from './pages/UserProfile'
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
            <Route path="/UserProfile" component={UserProfile} />
          </Switch>
        </Router>
      </main>
    );
  }
}

export default App;
