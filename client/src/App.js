import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import './styles/App.css';

class App extends Component {
  componentDidMount() {
    useEffect(() => {
      const token = localStorage.getItem('_token');
      if (!token) {

      }
    }, [])
  }
  render() {
    return (
      <main className="App">
        {/* Probably should include a nav bar here */}
        <Router>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={Home} />
            <Route path="/login" component={LoginPage} />
          </Switch>
        </Router>
      </main>
    );
  }
}

export default App;
