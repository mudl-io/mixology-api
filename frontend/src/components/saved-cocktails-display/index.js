import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import { didGetCocktails } from "../../features/saved-cocktails/savedCocktailsSlice";

import CocktailsList from "../cocktails-list";

class SavedCocktailsDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const savedCocktails = await axiosInstance.get(
      "/cocktails/saved_cocktails"
    );

    this.props.dispatch(didGetCocktails(savedCocktails.data));
  }

  render() {
    return (
      <div className="saved-cocktail-display">
        <CocktailsList
          title={"Saved Cocktails"}
          cocktails={_.sortBy(this.props.savedCocktails, ["name"])}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const savedCocktails = state.savedCocktails;
  return { savedCocktails: savedCocktails };
};

export default connect(mapStateToProps)(SavedCocktailsDisplay);
