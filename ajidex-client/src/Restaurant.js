import React from 'react';
import MenuItem from './MenuItem.js';
import Salad from './img/potato_salad_template.jpg';

const testSalad = {
  Name: "Sweet Potato Salad",
  Description: "A sweet potato salad with only the finest leafy lettuce and thick cut sweet potatoes. Our chef&#39;s finest creation in the world. Honestly idk how he does it.",
  Ingredients: ["Sweet Potato", "Lettuce"],
  Calories: 400,
  Textures: ["Fibrous", "Spongy"],
  Diets: ["Vegan", "Kosher"],
  Image: Salad
}

function Restaurant(props) {
  return (
    <div>
      <div className="menutitle">
        <h1>Restaurant Name</h1>
        <i>Restuarant image</i>
      </div>
      <div className="menu">
        <h2>Appetizers</h2>
        <MenuItem Name={testSalad.Name} Description={testSalad.Description} Ingredients={testSalad.Ingredients} Calories={testSalad.Calories} Textures={testSalad.Textures} Diets={testSalad.Diets} Image={testSalad.Image}/>
        <h2>Meals</h2>
      </div>
    </div>
  );
}

export default Restaurant;
