import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

/**
 *
 * @param {*} props
 * * @property {Object} cocktail
 * @returns a small <div> containing the essential elements of a cocktail in a small, reusable format
 */

const allIngredientsToString = (ingredients) => {
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  return <p className="ingredients">{ingredientNames.join(", ")}</p>;
};

const CocktailDetail = (props) => {
  return (
    <Link
      className="cocktail-detail"
      to={`/cocktail/${props.cocktail.publicId}/`}
      target="_blank"
    >
      <img src="http://localhost:8000/static/defaultimg.png" />
      <div className="name">{props.cocktail.name}</div>
      <div className="ingredients-list">
        {allIngredientsToString([
          ...props.cocktail.liquors,
          ...props.cocktail.ingredients,
        ])}
      </div>
    </Link>
  );
};

export default React.memo(CocktailDetail);
