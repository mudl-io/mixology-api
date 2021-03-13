import React from "react";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

// redux actions
import { didGetIngredients } from "../../features/ingredients/ingredientsSlice";
import { didGetLiquors } from "../../features/liquors/liquorsSlice";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import CocktailDisplay from "../cocktail-display";
import ListDropdown from "../list-dropdown";

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
      selectedIngredients: [],
      selectedLiquors: [],
      shouldBeExact: false,
      hideUserCocktails: false,
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
      const res = await axiosInstance.get("/cocktails/random_cocktail", {
        params: {
          liquors_filter: JSON.stringify(
            this.state.selectedLiquors.map((liquor) => liquor.publicId)
          ),
          ingredients_filter: JSON.stringify(
            this.state.selectedIngredients.map(
              (ingredient) => ingredient.publicId
            )
          ),
          find_exact_match: this.state.shouldBeExact,
          hide_user_cocktails: this.state.hideUserCocktails,
        },
      });

      if (res.status === 204) {
        NotificationManager.warning(
          "Unfortunately, we were unable to find an exact match for you based on your filters. Try adjusting your filters or checking off the exact match button.",
          "No Cocktail Found",
          5000
        );
      } else {
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
      }
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

  handleSelect = (optionName) => (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);

    this.setState({ [optionName]: values });
  };

  toggleExactMatch = () => {
    this.setState({ shouldBeExact: !this.state.shouldBeExact });
  };

  toggleShowUserCocktails = () => {
    this.setState({ hideUserCocktails: !this.state.hideUserCocktails });
  };

  render() {
    return (
      <div className="homepage-container">
        <div className="cocktail-display">
          {this.showCocktailDetails()}
          <div
            className={
              this.state.name.length > 0
                ? "cocktail-options active"
                : "cocktail-options inactive"
            }
          >
            <Button
              variant="contained"
              className="cocktail-button"
              onClick={this.getCocktail}
            >
              Find a random cocktail
            </Button>
            <div className="filters">
              <div className="filter-dropdown liquors-filter">
                <div className="input-name">Filter By Liquor:</div>
                <ListDropdown
                  name="Liquors"
                  options={this.props.liquorOptions}
                  optionName="selectedLiquors"
                  handleSelect={this.handleSelect}
                />
              </div>
              <div className="filter-dropdown ingredients-filter">
                <div className="input-name">Filter By Ingredient:</div>
                <ListDropdown
                  name="Ingredients"
                  options={this.props.ingredientOptions}
                  optionName="selectedIngredients"
                  handleSelect={this.handleSelect}
                />
              </div>
              <div className="exact-match checkbox">
                <Checkbox
                  checked={this.state.shouldBeExact}
                  onChange={this.toggleExactMatch}
                />
                <span className="checkbox-text">Find Exact Match</span>
              </div>
              <div className="user-created checkbox">
                <Checkbox
                  checked={this.state.showUserCocktails}
                  onChange={this.toggleShowUserCocktails}
                />
                <span className="checkbox-text">
                  Hide User Created Cocktails
                </span>
              </div>
            </div>
          </div>
        </div>

        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { liquors, ingredients } = state;
  return { liquorOptions: liquors, ingredientOptions: ingredients };
};

export default connect(mapStateToProps)(Homepage);
