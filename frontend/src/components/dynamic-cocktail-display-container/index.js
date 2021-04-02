import React from "react";
import { connect } from "react-redux";

import { didSaveCocktail } from "../../features/saved-cocktails/savedCocktailsSlice";
import { didUnsaveCocktail } from "../../features/saved-cocktails/savedCocktailsSlice";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import CocktailDisplay from "../cocktail-display";

class DynamicCocktailDisplayContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      complexity: 0,
      image: "",
      liquors: [],
      ingredients: [],
      createdBy: null,
      isSaved: false,
      timesSaved: 0,
    };
  }

  async componentDidMount() {
    const cocktailId = this.props.match.params.id;

    // try to see if cocktail is in redux store before making a network request
    let displayCocktail = this.props.savedCocktails.find(
      (cocktail) => cocktail.publicId === cocktailId
    );

    if (!displayCocktail) {
      displayCocktail = await axiosInstance.get(`/cocktails/${cocktailId}`);
      displayCocktail = displayCocktail.data;
    }

    this.setState({
      cocktail: displayCocktail,
      cocktailId: cocktailId,
      name: displayCocktail.name,
      description: displayCocktail.description,
      complexity: displayCocktail.complexity,
      image: displayCocktail.image,
      createdBy: displayCocktail.createdBy,
      instructions: displayCocktail.instructions,
      liquors: displayCocktail.liquors,
      ingredients: displayCocktail.ingredients,
      isSaved: displayCocktail.isSaved,
      timesSaved: displayCocktail.timesSaved,
    });
  }

  toggleSaveCocktail = async () => {
    try {
      if (!this.state.isSaved) {
        await axiosInstance.post("/cocktails/save_cocktail/", {
          public_id: this.state.cocktailId,
        });

        this.setState({ isSaved: true, timesSaved: this.state.timesSaved + 1 });

        this.props.dispatch(didSaveCocktail(this.state.cocktail));
      } else {
        await axiosInstance.post("/cocktails/unsave_cocktail/", {
          public_id: this.state.cocktailId,
        });

        this.setState({
          isSaved: false,
          timesSaved: this.state.timesSaved - 1,
        });

        this.props.dispatch(didUnsaveCocktail(this.state.cocktailId));
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div className="dynamic-cocktail-container">
        <CocktailDisplay
          name={this.state.name}
          description={this.state.description}
          complexity={this.state.complexity}
          image={this.state.image}
          ingredients={this.state.ingredients}
          liquors={this.state.liquors}
          instructions={this.state.instructions}
          createdBy={this.state.createdBy}
          isSaved={this.state.isSaved}
          timesSaved={this.state.timesSaved}
          toggleSaveCocktail={this.toggleSaveCocktail}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const savedCocktails = state.savedCocktails;
  return { savedCocktails: savedCocktails };
};

export default connect(mapStateToProps)(DynamicCocktailDisplayContainer);
