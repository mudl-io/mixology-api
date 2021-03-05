import React from "react";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { FiHelpCircle } from "react-icons/fi";
import Tooltip from "@material-ui/core/Tooltip";

import "./styles.scss";
import axiosInstance from "../../axiosApi";

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
      cocktailNameValid: true,
      selectedLiquorsClass: {},
      selectedIngredientsClass: {},
      complexityClass: {},
      instructionsValid: true,
      submittedForm: false,
      errorMessageActive: false,
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
    const isEmpty = event.target.value.trim().length === 0;
    const key = event.target.name + "Valid";
    this.setState({ [event.target.name]: event.target.value, [key]: !isEmpty });
  };

  handleSelect = (name) => (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    const key = name + "Class";
    const styles = {
      control: (provided) => ({
        ...provided,
        borderWidth: values.length > 0 ? "" : "2px",
        borderColor: values.length > 0 ? "" : "red",
      }),
    };

    this.setState({ [name]: values, [key]: styles });
  };

  handleSelectComplexity = (selectedComplexity) => {
    const isValidStyles = {
      control: (provided) => ({
        ...provided,
        borderWidth: "",
        borderColor: "",
      }),
    };

    this.setState({
      complexity: selectedComplexity.value,
      complexityClass: isValidStyles,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = this.validateForm();

    if (isValid) {
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
        NotificationManager.success(
          'Your cocktail was successfully created! You can now view this in the "Created Cocktails" section in your profile.',
          "Cocktail Submitted",
          2000
        );
        setTimeout(() => {
          this.setState({ submittedForm: true });
        }, 2000);

        return response;
      }
    } else {
      if (!this.state.errorMessageActive) {
        this.setState({ errorMessageActive: true });
        NotificationManager.error(
          "Please fill out all required inputs in order to create your cocktail",
          "Invalid Input",
          2000,
          () => this.setState({ errorMessageActive: false })
        );

        setTimeout(() => {
          this.setState({ errorMessageActive: false });
        }, 2000);
      }
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

  validateForm = () => {
    const cocktailNameValid = this.state.cocktailName.trim().length > 0;
    const selectedIngredientsValid = this.state.selectedIngredients.length > 0;
    const selectedLiquorsValid = this.state.selectedLiquors.length > 0;
    const instructionsValid = this.state.instructions.trim().length > 0;
    const complexityIsValid = this.state.complexity > 0;
    const formIsValid =
      cocktailNameValid &&
      selectedIngredientsValid &&
      selectedLiquorsValid &&
      complexityIsValid &&
      instructionsValid;

    if (!formIsValid) {
      const ingredientsStyles = {
        control: (provided) => ({
          ...provided,
          borderWidth: this.state.selectedIngredients.length > 0 ? "" : "2px",
          borderColor: this.state.selectedIngredients.length > 0 ? "" : "red",
        }),
      };

      const liquorsStyles = {
        control: (provided) => ({
          ...provided,
          borderWidth: this.state.selectedLiquors.length > 0 ? "" : "2px",
          borderColor: this.state.selectedLiquors.length > 0 ? "" : "red",
        }),
      };

      const complexityStyles = {
        control: (provided) => ({
          ...provided,
          borderWidth: this.state.complexity > 0 ? "" : "2px",
          borderColor: this.state.complexity > 0 ? "" : "red",
        }),
      };

      this.setState({
        cocktailNameValid,
        instructionsValid,
        selectedIngredientsClass: ingredientsStyles,
        selectedLiquorsClass: liquorsStyles,
        complexityClass: complexityStyles,
      });
    }

    return formIsValid;
  };

  shouldRedirect = () => {
    if (this.state.submittedForm) {
      return <Redirect to={{ pathname: "/" }} />;
    }
  };

  render() {
    return (
      <div className="create-cocktail-container">
        <form className="create-cocktail-form" onSubmit={this.handleSubmit}>
          <label className="cocktail-name-input">
            <div className="input-name">Name*:</div>
            <input
              name="cocktailName"
              className={this.state.cocktailNameValid ? "" : "invalid"}
              type="text"
              value={this.state.cocktailName}
              onChange={this.handleChange}
            />
          </label>
          <label className="dropdown-select">
            <div className="input-name">Liquors*:</div>
            <Select
              styles={this.state.selectedLiquorsClass}
              name="Liquors"
              options={this.buildOptions("liquorOptions")}
              isMulti
              onChange={this.handleSelect("selectedLiquors")}
            />
          </label>
          <label className="dropdown-select">
            <div className="input-name">Ingredients*:</div>
            <Select
              styles={this.state.selectedIngredientsClass}
              name="Ingredients"
              options={this.buildOptions("ingredientOptions")}
              isMulti
              onChange={this.handleSelect("selectedIngredients")}
            />
          </label>
          <label className="input-text-area">
            <div className="input-name">Instructions*:</div>
            <textarea
              name="instructions"
              className={this.state.instructionsValid ? "" : "invalid"}
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
            <div className="input-name">Complexity*:</div>
            <Select
              styles={this.state.complexityClass}
              name="Complexity"
              options={this.complexityOptions()}
              onChange={this.handleSelectComplexity}
            />
            <Tooltip
              title="A measure of how hard this drink is to make!"
              placement="top"
            >
              <span className="help-icon">
                <FiHelpCircle />
              </span>
            </Tooltip>
          </label>
          <input
            className="create-cocktail-submit-button"
            type="submit"
            value="Create Cocktail"
          />
        </form>

        {this.shouldRedirect()}

        <NotificationContainer />
      </div>
    );
  }
}
export default CreateCocktailForm;
