import React from "react";
import { Button } from "@material-ui/core";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
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
      error: "",
    };
  }

  getCocktail = async () => {
    try {
      const res = await axiosInstance.get("/cocktails/random_cocktail");
      const cocktail = res.data;

      this.setState({
        name: cocktail.name,
        description: cocktail.description,
        amtSaved: cocktail.amtSaved,
        complexity: cocktail.complexity,
        image: cocktail.image,
        ingredients: cocktail.ingredients,
        liquors: cocktail.liquors,
        instructions: cocktail.instructions,
        error: "",
      });
    } catch (e) {
      this.setState({
        error: "Error retrieving cocktails",
      });
    }
  };

  showCocktailDetails = () => {
    let content;
    if (!this.state.error) {
      content = (
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
      );
    } else {
      content = <div>{this.state.error}</div>;
    }
    return content;
  };

  render() {
    return (
      <div className="container">
        {this.showCocktailDetails()}
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
