import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Header } from './Header.js';
import Contact from './Contact.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/contact" component={Contact} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
