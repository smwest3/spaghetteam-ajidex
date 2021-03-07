import React from 'react';
import MenuItem from './MenuItem.js';
import Salad from './img/potato_salad_template.jpg';

const testSalad = {
  Name: "Sweet Potato Salad",
  Description: "A sweet potato salad with only the finest leafy lettuce and thick cut sweet potatoes. Our chef's finest creation in the world. Honestly idk how he does it.",
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
        <MenuItem Name="Pork Soda" Description="Easy on the tongue" Ingredients={testSalad.Ingredients} Calories={200} Textures={["Smooth, like jazz"]} Diets={["Keto"]} Image="https://ih1.redbubble.net/image.418980247.7118/flat,128x128,075,t-pad,128x128,f8f8f8.u3.jpg" />
        <h2>Meals</h2>
      </div>
    </div>
  );
}

export default Restaurant;
