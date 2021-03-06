import React from 'react';

function Restaurant(props) {
  return (
    <div>
      <div className="menutitle">
        <h1>Restaurant Name</h1>
        <i>Restuarant image</i>
      </div>
      <div className="menu">
        <h2>Appetizers</h2>
        <p>chicken sandwich card</p>
        <h2>Meals</h2>
        <p>potato salad card</p>
      </div>
    </div>
  );
}

export default Restaurant;
