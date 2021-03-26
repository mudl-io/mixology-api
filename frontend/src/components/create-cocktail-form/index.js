import React from "react";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Checkbox from "@material-ui/core/Checkbox";
import { connect } from "react-redux";
import _ from "lodash";

// redux actions
import { didGetIngredients } from "../../features/ingredients/ingredientsSlice";
import { didGetLiquors } from "../../features/liquors/liquorsSlice";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import HelpIcon from "../help-icon";
import ListDropdown from "../list-dropdown";
import AmountsInput from "../amounts-input";

class CreateCocktailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktailName: "",
      description: "",
      complexity: 0,
      instructions: "",
      selectedIngredients: [],
      selectedLiquors: [],
      isPrivate: false,
      cocktailNameValid: true,
      selectedLiquorsAreValid: true,
      selectedIngredientsAreValid: true,
      complexityClass: {},
      instructionsValid: true,
      submittedForm: false,
      errorMessageActive: false,
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

  handleChange = (event) => {
    const isEmpty = event.target.value.trim().length === 0;
    const key = event.target.name + "Valid";
    this.setState({ [event.target.name]: event.target.value, [key]: !isEmpty });
  };

  handleSelect = (name) => (selectedOptions) => {
    const values = selectedOptions.map((option) => {
      let value = option.value;

      const existingValue = _.find(this.state[name], (item) => {
        return item.publicId === value.publicId;
      });

      if (existingValue) {
        value = { ...existingValue };
      } else {
        value = { ...value, amount: 0, unit: "oz" };
      }

      return value;
    });
    const selectClassName = name + "AreValid";
    const isValid = values.length > 0;

    this.setState({ [name]: values, [selectClassName]: isValid });
  };

  handleSelectComplexity = (selectedComplexity) => {
    const isValidStyles = {
      control: (provided) => ({
        ...provided,
        borderWidth: "1px",
        borderColor: "hsl(0, 0%, 80%)",
      }),
    };

    this.setState({
      complexity: selectedComplexity.value,
      complexityClass: isValidStyles,
    });
  };

  /**
   *
   * @param {integer} itemId
   * @param {String} property
   *
   * @returns undefined
   *
   * takes in the publicId of a selectedLiquor or selectedIngredient
   * and finds the active ingredient
   * then updates it's unit or amount property to the selected value
   */
  updateProperty = (itemId, property) => (event) => {
    const updatedIngredient = _.find(
      this.state.selectedIngredients,
      (ingredient) => {
        return ingredient.publicId === itemId;
      }
    );

    const updatedLiquor = _.find(this.state.selectedLiquors, (liquor) => {
      return liquor.publicId === itemId;
    });

    const itemToUpdate = updatedIngredient || updatedLiquor;
    const key = updatedIngredient ? "selectedIngredients" : "selectedLiquors";

    // this looks more confusing than it is
    // iterate through the existing array of selectedIngredients or selectedLiquors
    // and when you find the item to be updated, update the property (unit or amount)
    this.setState((prevState) => ({
      [key]: prevState[key].map((item) => {
        if (item.publicId === itemToUpdate.publicId) {
          const updatedItem = {
            ...itemToUpdate,
            [property]: event.target.value,
          };
          return updatedItem;
        }

        return item;
      }),
    }));
  };

  toggleIsPrivate = () => {
    this.setState({ isPrivate: !this.state.isPrivate });
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
          isPrivate: this.state.isPrivate,
        });

        NotificationManager.success(
          'Your cocktail was successfully created! You can now view this in the "Created Cocktails" section in your profile.',
          "Cocktail Submitted",
          2000
        );
        setTimeout(() => {
          this.setState({ submittedForm: true });
        }, 2000);
      } catch (error) {
        NotificationManager.error(
          "There was an error creating your cocktail, please try resubmitting or refreshing the page.",
          "Creation Error",
          2000
        );
        throw error;
      } finally {
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
    if (this.props[optionName].length > 0) {
      return this.props[optionName].map((option) => {
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
      const complexityStyles = {
        control: (provided) => ({
          ...provided,
          borderWidth: this.state.complexity > 0 ? "1px" : "2px",
          borderColor: this.state.complexity > 0 ? "hsl(0, 0%, 80%)" : "red",
        }),
      };

      this.setState({
        cocktailNameValid,
        instructionsValid,
        selectedIngredientsAreValid: this.state.selectedIngredients.length > 0,
        selectedLiquorsAreValid: this.state.selectedLiquors.length > 0,
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
            <ListDropdown
              name="Liquors"
              options={this.props.liquorOptions}
              optionName="selectedLiquors"
              error={!this.state.selectedLiquorsAreValid}
              handleSelect={this.handleSelect}
            />
          </label>
          <div className="liquor-amounts">
            <AmountsInput
              items={this.state.selectedLiquors}
              updateProperty={this.updateProperty}
            />
          </div>
          <label className="dropdown-select">
            <div className="input-name">Ingredients*:</div>
            <ListDropdown
              name="Ingredients"
              options={this.props.ingredientOptions}
              optionName="selectedIngredients"
              error={!this.state.selectedIngredientsAreValid}
              handleSelect={this.handleSelect}
            />
          </label>
          <div className="ingredient-amounts">
            <AmountsInput
              items={this.state.selectedIngredients}
              updateProperty={this.updateProperty}
            />
          </div>
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
          <label className="dropdown-select complexity">
            <div className="input-name">Complexity*:</div>
            <Select
              styles={this.state.complexityClass}
              name="Complexity"
              options={this.complexityOptions()}
              onChange={this.handleSelectComplexity}
            />
            <HelpIcon
              title="A measure of how hard this drink is to make!"
              placement="top"
            />
          </label>
          <div className="private-cocktail-checkbox">
            <Checkbox
              checked={this.state.isPrivate}
              onChange={this.toggleIsPrivate}
            />
            <span className="checkbox-text">Make private</span>
          </div>
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

const mapStateToProps = (state) => {
  const { liquors, ingredients } = state;
  return { liquorOptions: liquors, ingredientOptions: ingredients };
};

export default connect(mapStateToProps)(CreateCocktailForm);
