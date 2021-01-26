import React from "react";
import "./styles.scss";

class CocktailDisplay extends React.Component {
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
      const ingredients = [...this.props.ingredients, ...this.props.liquors];
      return (
        <ul className="ingredients-list">
          {ingredients.map((ingredient) => (
            <li>{ingredient.name}</li>
          ))}
        </ul>
      );
    }
  };

  cocktailDetails = () => {
    return (
      <div className="cocktail-details">
        <img src="http://localhost:8000/static/defaultimg.png" />
        <h2>{this.props.name}</h2>
        <h3 className="cocktail-description">{this.props.description}</h3>
        <div>
          <h3>Instructions:</h3>
          <p>{this.props.instructions}</p>
        </div>
        <div className="ingredients-container">
          <h3 className="ingredients-header">Ingredients:</h3>
          {this.listIngredients()}
        </div>
        <div>Times Saved: {this.props.amtSaved}</div>
        <div>Complexity: {this.props.complexity}/10</div>
      </div>
    );
  };

  render() {
    return <div>{this.showCocktailDetails()}</div>;
  }
}

export default CocktailDisplay;
