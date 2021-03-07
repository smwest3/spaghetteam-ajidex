import React from 'react';
import MenuItem from './MenuItem.js';

function Restaurant(props) {
  return (
    <div>
      <div className="menutitle">
        <h1>Restaurant Name</h1>
        <i>Restuarant image</i>
      </div>
      <div className="menu">
        <h2>Appetizers</h2>
        <MenuItem />
        <MenuItem />
        <h2>Meals</h2>
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </div>
    </div>
  );
}

export default Restaurant;
