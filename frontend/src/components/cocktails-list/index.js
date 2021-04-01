import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";
import CocktailDetail from "../cocktail-detail";

const list = (cocktails) => {
  return (
    <div className="cocktails-list">
      {cocktails.map((cocktail) => {
        return <CocktailDetail cocktail={cocktail} key={cocktail.publicId} />;
      })}
    </div>
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
