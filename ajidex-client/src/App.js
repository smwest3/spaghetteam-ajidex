import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Header } from './Header.js';
import Contact from './Contact.js';
import Home from './Home.js';
import Diet from './Diet.js';
import Profile from './Profile.js';
import Settings from './Settings.js';
import About from './About.js';
import Restaurants from './Restaurants.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth0 } from "./react-auth0-spa";
import LogToast from './LogToast'

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/diet" component={Diet} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/settings" component={Settings} />
          <Route path="/restaurants" component={Restaurants} />
          <Redirect to="/" />
        </Switch>
        {!isAuthenticated && (
          <LogToast />
        )}
      </main>
    </div>
  );
}

export default App;
