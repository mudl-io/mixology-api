import React from "react";
import { Button } from "@material-ui/core";
import "./styles.scss";
import axios from "axios";
import CocktailDisplay from "../cocktail-display";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      amtSaved: 0,
      complexity: 0,
      image: "",
    };
  }

  getCocktail = async () => {
    const res = await axios.get("cocktails/random_cocktail");
    const cocktail = res.data;

    console.log(cocktail);

    this.setState({
      name: cocktail.name,
      description: cocktail.description,
      amtSaved: cocktail.amtSaved,
      complexity: cocktail.complexity,
      image: cocktail.image,
      ingredients: cocktail.ingredients,
      liquors: cocktail.liquors,
      instructions: cocktail.instructions,
    });
  };

  render() {
    return (
      <div className="container">
        <CocktailDisplay
          name={this.state.name}
          description={this.state.description}
          amtSaved={this.state.amtSaved}
          complexity={this.state.complexity}
          image={this.state.image}
          ingredients={this.state.ingredients}
          liquors={this.state.liquors}
          instructions={this.state.instructions}
        />
        <Button
          variant="contained"
          className="cocktail-button"
          onClick={this.getCocktail}
        >
          Find a random cocktail
        </Button>
      </div>
    );
  }
}

export default Homepage;
