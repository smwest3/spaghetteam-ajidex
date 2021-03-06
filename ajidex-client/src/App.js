import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Header } from './Header.js';
import Contact from './Contact.js';
import Home from './Home.js';
import Diet from './Diet.js';
import Profile from './Profile.js';
import Settings from './Settings.js';
import About from './About.js';
import Restaurant from './Restaurant.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/diet" component={Diet} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/settings" component={Settings} />
            <Route path="/restaurant" component={Restaurant} />
            <Redirect to="/" />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
