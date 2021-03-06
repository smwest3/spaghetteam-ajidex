import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem.js";
import RestItem from "./RestItem.js";
import Salad from "./img/potato_salad_template.jpg";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import {
  Switch,
  Route,
  useParams,
  Redirect,
  useRouteMatch,
} from "react-router-dom";
import api from "./APIEndpoints";

// Use as base
const testRest = {
  Name: "Paddy's Pub",
  Image:
    "https://i.reddituploads.com/82435827a2e44f7aa2c2782dd20e4ba6?fit=max&h=1536&w=1536&s=d0407d4a63a463e45ee60ddc83f62764",
  Url: "paddys-pub",
  Address: "3rd & Dickinson",
  Description: "A trendy bar in southern Philly",
  Menu: [
    {
      Category: "Appetizers",
      Items: [
        {
          Name: "Sweet Potato Salad",
          Description:
            "A sweet potato salad with only the finest leafy lettuce and thick cut sweet potatoes. Our chef's finest creation in the world. Honestly idk how he does it.",
          Price: "$12.33",
          Ingredients: ["Sweet Potato", "Lettuce"],
          Calories: 400,
          Textures: ["Fibrous", "Spongy"],
          Diets: ["Vegan", "Kosher"],
          Image: Salad,
        },
        {
          Name: "Taco Salad",
          Description: "A salad made of tacos",
          Price: "$10.99",
          Ingredients: ["Tortilla", "Flour", "Salsa", "Tomato"],
          Calories: 450,
          Textures: ["Tangy", "Spongy"],
          Diets: [],
          Image:
            "https://bigoven-res.cloudinary.com/image/upload/d_recipe-no-image.jpg,t_recipe-256/spicy-dorito-taco-salad-23aed0.jpg",
        },
      ],
    },
    {
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
          Image:
            "https://ih1.redbubble.net/image.418980247.7118/flat,128x128,075,t-pad,128x128,f8f8f8.u3.jpg",
        },
      ],
    },
  ],
};

//state to keep track of restaurants returned
const subState = {
  error: "",
  requestFinished: true,
  loading: false,
};

//sends GET request to API to retrieve list of all restaurants
async function sendRestaurantRequest(restName) {
  subState.loading = true;
  subState.requestFinished = false;
  let searchQuery = "";
  if (restName.length != 0) {
    searchQuery = "?name=" + restName;
  }
  const response = await fetch(
    api.base + api.handlers.restaurants + searchQuery,
    {
      method: "GET",
    }
  );
  if (response.status >= 300) {
    const error = await response.text();
    console.log(error);
    subState.error = error;
    return;
  }
  if (subState.error.length != 0) {
    subState.error = "";
  }
  const restaurantList = await response.json();
  subState.loading = false;
  subState.requestFinished = true;
  return restaurantList.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    address: restaurant.address,
    city: restaurant.city,
    state: restaurant.state,
    zip: restaurant.zip,
    img: restaurant.img,
    url: restaurant.url,
    menu: restaurant.menu,
  }));
}

//sends GET request to API to retrieve specific a restaurant with given URL
async function sendSpecRestaurantRequest(restURL) {
  subState.loading = true;
  subState.requestFinished = false;
  const response = await fetch(api.base + api.handlers.aRestaurant + restURL, {
    method: "GET",
  });
  if (response.status >= 300) {
    const error = await response.text();
    subState.error = error;
    return;
  }
  if (subState.error.length != 0) {
    subState.error = "";
  }
  const restaurant = await response.json();
  subState.loading = false;
  subState.requestFinished = true;
  return JSON.parse(JSON.stringify(restaurant));
}

// Decides which to show: specific restaurants or the search page
function Restaurants(props) {
  let { path, url } = useRouteMatch();
  return (
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

// Shows the search page based on whatever the user searches
function RestaurantSearch(props) {
  const [query, setQuery] = useState();
  const [restaurants, setRestaurants] = useState([]);
  const { search } = window.location;
  const terms = new URLSearchParams(search).get("rest");

  useEffect(async () => {
    if (terms != null) {
      sendRestaurantRequest(terms).then((result) => setRestaurants(result));
    }
  }, []);

  let restItems = null;
  if (terms != null && terms != "") {
    if (restaurants != null) {
      restItems = restaurants.map((item) => {
        return (
          <RestItem
            key={item.url}
            Name={item.name}
            Url={item.url}
            Image={item.img}
            Address={item.address}
            Description={item.description}
          />
        );
      });
    } else {
      restItems = "No results found (Try searching for 'paddy')";
    }
  }
  return (
    <div
      style={{
        fontFamily: "Raleway",
      }}
    >
      <Form action="/restaurants" method="get" autoComplete="off">
        <Form.Row>
          <Col>
            <FormControl
              type="text"
              value={query}
              onSubmit={(e) => setQuery(e.target.value)}
              id="rest-search"
              name="rest"
              placeholder="Find a Restaurant"
            />
          </Col>
          <Col>
            <Button className="searchbtn" type="submit">
              Search
            </Button>
          </Col>
        </Form.Row>
      </Form>
      <div>{restItems ? restItems : <p>Search for a restaurant above!</p>}</div>
    </div>
  );
}

// Shows the page for a specific restaurant
function Restaurant(props) {
  let { restId } = useParams();
  const [restaurant, setRestaurant] = useState();
  const [diet, setDiet] = useState();

  useEffect(async () => {
    sendSpecRestaurantRequest(restId).then((result) => setRestaurant(result));
    subState.loading = true;
    subState.requestFinished = false;

    const response = await fetch(api.base + api.handlers.mydiet, {
      method: "GET",
      headers: new Headers({
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      }),
    });
    if (response.status >= 300) {
      const error = await response.text();
      console.log(error);
      subState.error = error;
      return;
    }
    if (subState.error.length != 0) {
      subState.error = "";
    }
    const diet = await response.json();
    subState.loading = false;
    subState.requestFinished = true;
    setDiet(diet);
  }, []);

  if (subState.error.length != 0) {
    console.log(subState.error);
    return <Redirect to="/restaurants/" />;
  }
  let menu;
  if (subState.loading || restaurant == null) {
    return <h2>Loading...</h2>;
  } else {
    menu = restaurant.menu.menulist.map((cat) => {
      return (
        <div key={cat.category}>
          <h2>{cat.category}</h2>{" "}
          {cat.items.map((item) => {
            if (
              diet == null ||
              (!item.textures.some((r) => diet.textures.includes(r)) &&
                (diet.diets.length == 0 ||
                  item.diets.some((r) => diet.diets.includes(r))) &&
                !item.ingredients.some((r) => diet.allergens.includes(r)))
            )
              return (
                <MenuItem
                  key={item.name}
                  Name={item.name}
                  Description={item.descr}
                  Price={item.price}
                  Ingredients={item.ingredients}
                  Calories={item.calories}
                  Textures={item.textures}
                  Diets={item.diets}
                  Image={item.img}
                />
              );
          })}
        </div>
      );
    });
    return (
      <div
        style={{
          fontFamily: "Raleway",
        }}
      >
        <div className="menutitle">
          <h1>{restaurant.name}</h1>
          <Image
            width={400}
            rounded
            fluid
            src={restaurant.img}
            alt="A restaurant image"
          />
        </div>
        <div className="menu">
          {menu}
          <br />
          {diet ? (
            <p
              style={{
                fontFamily: "Raleway",
              }}
            >
              Can't find anything to eat?
              <Link to="/diet">
                <p
                  style={{
                    fontFamily: "Raleway",
                    color: "#CC5216",
                    fontWeight: 700,
                  }}
                >
                  Edit your diet
                </p>
              </Link>
            </p>
          ) : (
            <br />
          )}
        </div>
      </div>
    );
  }
}

export default Restaurants;
