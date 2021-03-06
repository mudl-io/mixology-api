import React from "react";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";

// redux actions
import { didGetIngredients } from "../../features/ingredients/ingredientsSlice";
import { didGetLiquors } from "../../features/liquors/liquorsSlice";

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

  async componentDidMount() {
    // only make network request to get liquors and ingredients if the store is not already filled
    try {
      if (
        this.props.ingredientOptions.length === 0 &&
        this.props.liquorOptions.length === 0
      ) {
        const [ingredients, liquors] = await Promise.all([
          axiosInstance.get("/ingredients/"),
          axiosInstance.get("/liquors/"),
        ]);

        this.props.dispatch(didGetIngredients(ingredients.data));
        this.props.dispatch(didGetLiquors(liquors.data));
      }
    } catch (e) {
      console.log(e);
    }
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

const mapStateToProps = (state) => {
  const { liquors, ingredients } = state;
  return { liquorOptions: liquors, ingredientOptions: ingredients };
};

export default connect(mapStateToProps)(Homepage);
