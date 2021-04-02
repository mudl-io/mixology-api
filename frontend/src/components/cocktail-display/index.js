import React from "react";

import "./styles.scss";
import HeartCheckbox from "../heart-checkbox";

class CocktailDisplay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
    };
  }

  showCocktailDetails = () => {
    if (this.props.name) {
      return this.cocktailDetails(this.props.cocktail);
    }
  };

  listIngredients = () => {
    if (this.props.ingredients && this.props.liquors) {
      const ingredients = [...this.props.liquors, ...this.props.ingredients];
      return (
        <ul className="ingredients-list">
          {ingredients.map((ingredient) => (
            <li key={`${ingredient.public_id}-${ingredient.name}`}>
              <span>
                {ingredient.name} - {ingredient.amount} {ingredient.unit}
              </span>
            </li>
          ))}
        </ul>
      );
    }
  };

  createdBy = () => {
    if (this.props.createdBy) {
      return (
        <span className="complexity stat">
          Created By: {this.props.createdBy.username}
        </span>
      );
    }
  };

  getImage = () => {
    if (this.props.image) {
      return this.props.image.image;
    }

    return "http://localhost:8000/static/defaultimg.png";
  };

  cocktailDetails = () => {
    return (
      <div className="cocktail-details">
        <div className="img-and-stats">
          <img src={this.getImage()} />
          <h2>{this.props.name}</h2>
          <span className="heart-checkbox">
            <HeartCheckbox
              isChecked={this.props.isSaved}
              handleClick={this.props.toggleSaveCocktail}
              tabIndex="0"
            />
          </span>
          <span className="saved stat">
            Times Saved: {this.props.timesSaved}
          </span>
          <span className="complexity stat">
            Complexity: {this.props.complexity}/10
          </span>
          {this.createdBy()}
        </div>
        <div>
          <h3 className="header">Description</h3>
          <p className="content">{this.props.description}</p>
        </div>
        <div className="ingredients-container">
          <h3 className="ingredients header">Ingredients</h3>
          {this.listIngredients()}
        </div>
        <div>
          <h3 className="header">Instructions</h3>
          <p className="content">{this.props.instructions}</p>
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.showCocktailDetails()}</div>;
  }
}

export default CocktailDisplay;
