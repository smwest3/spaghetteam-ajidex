import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import api from "./APIEndpoints.js";
import { Header } from "./Header.js";
import Contact from "./Contact.js";
import Home from "./Home.js";
import { Diet } from "./Diet.js";
import Profile from "./Profile.js";
import Settings from "./Settings.js";
import About from "./About.js";
import Restaurants from "./Restaurants.js";
import "bootstrap/dist/css/bootstrap.min.css";
import LogToast from "./LogToast";
import SignIn from "./Auth/Components/SignIn/SignIn.js";
import SignUp from "./Auth/Components/SignUp/SignUp.js";

async function getCurrentUser(authToken) {
  if (!authToken) {
    return;
  }
  const response = await fetch(api.base + api.handlers.myprofile, {
    headers: new Headers({
      Authorization: authToken,
    }),
  });
  if (response.status >= 300) {
    alert("Unable to verify login. Logging out...");
    localStorage.setItem("Authorization", "");
    return null;
  }
  const user = await response.json();
  return user;
}

const App = () => {
  const [user, setUser] = useState(null);
  const [userRequest, setUserRequest] = useState({
    loading: false,
  });

  useEffect(() => {
    let authToken = localStorage.getItem("Authorization");
    getCurrentUser(authToken).then((result) => setUser(result));
  }, [user]);

  return (
    <div className="App">
      <Header user={user} setUser={setUser} />
      <main>
        {!user && <LogToast />}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/diet" component={Diet} />
          <Route exact path="/settings" component={Settings} />
          <Route path="/restaurants" component={Restaurants} />
          <Route path="/signin">
            <SignIn setUser={setUser} />
          </Route>
          <Route path="/signup">
            <SignUp setUser={setUser} />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  );
};

export default App;

/*<SignIn setUser={setUser()} />
 <SignUp setUser={setUser()} />*/
