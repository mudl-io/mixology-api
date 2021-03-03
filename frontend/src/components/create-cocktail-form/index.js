import React from "react";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import Select from "react-select";
import { Button } from "bootstrap";

class CreateCocktailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktailName: "",
      description: "",
      complexity: 0,
      ingredientOptions: "",
      liquorOptions: "",
      instructions: "",
      selectedIngredients: [],
      selectedLiquors: [],
    };
  }

  async componentDidMount() {
    try {
      const [ingredients, liquors] = await Promise.all([
        axiosInstance.get("/ingredients/"),
        axiosInstance.get("/liquors/"),
      ]);

      this.setState({
        ingredientOptions: ingredients.data,
        liquorOptions: liquors.data,
      });
    } catch (e) {
      console.log(e);
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSelect = (name) => (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);

    this.setState({ [name]: values });
  };

  handleSelectComplexity = (selectedComplexity) => {
    this.setState({ complexity: selectedComplexity.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    let response;
    try {
      response = await axiosInstance.post("/cocktails/", {
        name: this.state.cocktailName,
        description: this.state.description,
        complexity: this.state.complexity,
        instructions: this.state.instructions,
        liquors: this.state.selectedLiquors,
        ingredients: this.state.selectedIngredients,
      });
    } catch (error) {
      throw error;
    } finally {
      return response;
    }
  };

  buildOptions = (optionName) => {
    if (this.state[optionName].length > 0) {
      return this.state[optionName].map((option) => {
        return {
          value: option,
          label: option.name,
          type:
            optionName === "ingredientOptions"
              ? "selectedIngredients"
              : "selectedLiquors",
        };
      });
    }
  };

  complexityOptions = () => {
    return [...Array(10).keys()].map((val) => {
      return { value: 1 + val, label: 1 + val };
    });
  };

  render() {
    return (
      <div className="create-cocktail-container">
        <form className="create-cocktail-form" onSubmit={this.handleSubmit}>
          <label className="cocktail-name-input">
            <div className="input-name">Name:</div>
            <input
              name="cocktailName"
              type="text"
              value={this.state.cocktailName}
              onChange={this.handleChange}
            />
          </label>
          <label className="dropdown-select">
            <div className="input-name">Liquors:</div>
            <Select
              className="select-dropdown liquors-select"
              name="Liquors"
              options={this.buildOptions("liquorOptions")}
              isMulti
              onChange={this.handleSelect("selectedLiquors")}
            />
          </label>
          <label className="dropdown-select">
            <div className="input-name">Ingredients:</div>
            <Select
              className="select-dropdown ingredients-select"
              name="Ingredients"
              options={this.buildOptions("ingredientOptions")}
              isMulti
              onChange={this.handleSelect("selectedIngredients")}
            />
          </label>
          <label className="input-text-area">
            <div className="input-name">Instructions:</div>
            <textarea
              name="instructions"
              type="textarea"
              value={this.state.instructions}
              onChange={this.handleChange}
            />
          </label>
          <label className="input-text-area">
            <div className="input-name">Description:</div>
            <textarea
              name="description"
              type="textarea"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </label>
          <label className="dropdown-select">
            <div className="input-name">Complexity:</div>
            <Select
              className="select-dropdown complexity-select"
              name="Complexity"
              options={this.complexityOptions()}
              onChange={this.handleSelectComplexity}
            />
          </label>
          <input
            className="create-cocktail-submit-button"
            type="submit"
            value="Create Cocktail"
          />
        </form>
      </div>
    );
  }
}
export default CreateCocktailForm;
