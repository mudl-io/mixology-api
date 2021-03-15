import React from "react";
import Drawer from "@material-ui/core/Drawer";

class RightCocktailSidenav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Drawer
        anchor="right"
        open={this.props.showMoreCocktails}
        onClose={this.props.toggleShowMoreCocktails}
      >
        <div>OPEN DRAWER</div>
      </Drawer>
    );
  }
}

export default RightCocktailSidenav;
