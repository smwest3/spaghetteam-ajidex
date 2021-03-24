import React, { useState } from 'react';
import MenuItem from './MenuItem.js';
import Salad from './img/potato_salad_template.jpg';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import {
  Switch,
  Route,
  useParams,
  Redirect,
  useRouteMatch
} from "react-router-dom";
import api from './APIEndpoints';

//Use as base
const testRest = {
  Name: "Paddy's Pub",
  Image: "https://i.reddituploads.com/82435827a2e44f7aa2c2782dd20e4ba6?fit=max&h=1536&w=1536&s=d0407d4a63a463e45ee60ddc83f62764",
  Url: "paddys-pub",
  Address: "",
  Menu: [
    {
      Category: "Appetizers",
      Items: [
        {
          Name: "Sweet Potato Salad",
          Description: "A sweet potato salad with only the finest leafy lettuce and thick cut sweet potatoes. Our chef's finest creation in the world. Honestly idk how he does it.",
          Price: "$12.33",
          Ingredients: ["Sweet Potato", "Lettuce"],
          Calories: 400,
          Textures: ["Fibrous", "Spongy"],
          Diets: ["Vegan", "Kosher"],
          Image: Salad,
        }, {
          Name: "Taco Salad",
          Description: "A salad made of tacos",
          Price: "$10.99",
          Ingredients: ["Tortilla", "Flour", "Salsa", "Tomato"],
          Calories: 450,
          Textures: ["Tangy", "Spongy"],
          Diets: [],
          Image: "https://bigoven-res.cloudinary.com/image/upload/d_recipe-no-image.jpg,t_recipe-256/spicy-dorito-taco-salad-23aed0.jpg",
        }
      ]
    }, {
      Category: "Beverages",
      Items: [
        {
          Name: "Pork Soda",
          Description: "Easy on the tongue",
          Price: "$7.00",
          Ingredients: ["Pork", "Sugar"],
          Calories: 200,
          Textures: ["Smooth, like jazz"],
          Diets: ["Keto"],
          Image: "https://ih1.redbubble.net/image.418980247.7118/flat,128x128,075,t-pad,128x128,f8f8f8.u3.jpg",
        }
      ]
    }
  ]
}

/*
//state to keep track of restaurants returned
this.state={
  restaurants: [],
  specRestaurant: {},
  error: ""
}*/

//sends GET request to API to retrieve list of all restaurants
async function sendRestaurantRequest(){
  const response = await fetch(api.base + api.handlers.restaurants, {
    method: "GET"
  });
  if (response.status >= 300) {
    const error = await response.text();
    this.setState({ error })
    return
  }
  const restaurantList = await response.json();
  this.setState({
    restaurants: restaurantList.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      zip: restaurant.zip,
      img: restaurant.img,
      menu: restaurant.menu
    }))
  })
}

//current workaround for spec restaurant caller, sets specific restaurant in state to one with given id from array
function specRestaurantSetter(restId) {
  if (restId < this.state.restaurants.length) {
    this.setState({ specRestaurant: this.state.restaurants[restId]})
  } else {
    this.setState({ error: "Restaurant not found" })
  }
}


//sends GET request to API to retrieve specific a restaurant with given id
//incomplete, may not finish
/*
sendSpecRestaurantRequest = async(e, restId) => {
  const response = await fetch(api.base + api.handlers.restaurants, {
    method: "GET"
  });
  if (response.status >= 300) {
    const error = await response.text();
    this.setError(error);
    return
  }
  const restaurant = await response.json();
}*/

function Restaurants(props) {

  let { path, url } = useRouteMatch();
  //sendRestaurantRequest();
  return(
    <Switch>
      <Route exact path={path}>
        <RestaurantSearch />
      </Route>
      <Route path={`${path}/:restId`}>
          <Restaurant />
        </Route>
      <Redirect to="/restaurants" />
    </Switch>
  );
}

function RestaurantSearch(props) {
  return(
    <Container>
      <Form>
      <Form.Row>
      <Col>
        <FormControl type="text" placeholder="Find a Restaurant"/>
      </Col>
      <Col>
        <Button className="searchbtn">Search</Button>
      </Col>
      </Form.Row>
      </Form>
    </Container>
  );
}

function Restaurant(props) {

    let { restId } = useParams();

    /*specRestaurantSetter(restId);
    let errMessage = this.state.error
    if (errMessage == "Restaurant not found" || restId >= this.state.restaurants.length)
      { return(<Redirect to="/restaurants" />) }
    */
    let menu = testRest.Menu.map((cat) => {
      return (<div key={cat.Category}><h2>{cat.Category}</h2> {
        cat.Items.map((item) => {
          return(<MenuItem key={item.Name} Name={item.Name} Description={item.Description} Price={item.Price} Ingredients={item.Ingredients} Calories={item.Calories} Textures={item.Textures} Diets={item.Diets} Image={item.Image}/>);
        })
      }</div>);
    });

  return (
    <div>
      <div className="menutitle">
        <h1>{testRest.Name}</h1>
          <Image
            width={400}
            rounded
            fluid
            src={testRest.Image}
            alt="A restaurant image"
          />
      </div>
      <div className="menu">
        {menu}
      </div>
    </div>
  );
}

export default Restaurants;
