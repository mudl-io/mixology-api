import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

const list = (cocktails) => {
  return (
    <ul className="cocktail-list">
      {cocktails.map((cocktail) => {
        return (
          <Link to={`/cocktail/${cocktail.publicId}/`} key={cocktail.publicId}>
            <li key={cocktail.publicId}>{cocktail.name}</li>
          </Link>
        );
      })}
    </ul>
  );
};

const CocktailsList = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
      {list(props.cocktails)}
    </div>
  );
};

export default React.memo(CocktailsList);
