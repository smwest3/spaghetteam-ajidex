import React from 'react';
import MenuItem from './MenuItem.js';
import Salad from './img/potato_salad_template.jpg';
import Image from 'react-bootstrap/Image';
import {
  Switch,
  Route,
  useParams,
  Redirect,
  useRouteMatch
} from "react-router-dom";

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
          Ingredients: ["Sweet Potato", "Lettuce"],
          Calories: 400,
          Textures: ["Fibrous", "Spongy"],
          Diets: ["Vegan", "Kosher"],
          Image: Salad,
        }, {
          Name: "Taco Salad",
          Description: "A salad made of tacos",
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

function Restaurants(props) {

  let { path, url } = useRouteMatch();

  return(
    <Switch>
      <Route exact path={path}>
        <h3>Search from this list of restaurants!</h3>
      </Route>
      <Route path={`${path}/:restId`}>
          <Restaurant />
        </Route>
      <Redirect to="/restaurants" />
    </Switch>
  );
}


function Restaurant(props) {

    let { restId } = useParams();

    // query the backend to get the rest of the info
    if (restId != testRest.Url) { return(<Redirect to="/restaurants" />) }

    let menu = testRest.Menu.map((cat) => {
      return (<div key={cat.Category}><h2>{cat.Category}</h2> {
        cat.Items.map((item) => {
          return(<MenuItem key={item.Name} Name={item.Name} Description={item.Description} Ingredients={item.Ingredients} Calories={item.Calories} Textures={item.Textures} Diets={item.Diets} Image={item.Image}/>);
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
