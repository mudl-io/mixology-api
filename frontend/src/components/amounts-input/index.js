import React from "react";
import TextField from "@material-ui/core/TextField";

import "./styles.scss";

const unitDropdown = (item, props) => {
  const options = [
    {
      value: "oz",
      label: "oz",
    },
    {
      value: "dash(es)",
      label: "dash(es)",
    },
    {
      value: "cup(s)",
      label: "cup(s)",
    },
  ];

  return (
    <TextField
      className="outlined-select-currency-native"
      select
      label="Unit"
      value={item.unit}
      onChange={props.updateProperty(item.publicId, "unit")}
      SelectProps={{
        native: true,
      }}
      variant="outlined"
    >
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.value}
        </option>
      ))}
    </TextField>
  );
};

const AmountsInput = (props) => {
  return (
    <div className="amounts-input-list">
      {props.items.map((item) => {
        return (
          <div key={item.publicId} className="amount-input-item">
            <span className="item-name">{item.name}: </span>
            <TextField
              className="item-input"
              label="Amount"
              type="number"
              value={item.amount}
              onChange={props.updateProperty(item.publicId, "amount")}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: {
                  min: props.min,
                  max: props.max,
                  step: "any",
                },
              }}
              variant="outlined"
            />
            {unitDropdown(item, props)}
          </div>
        );
      })}
    </div>
  );
};

export default AmountsInput;
