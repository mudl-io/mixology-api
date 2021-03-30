import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";

const buildOptions = (options) => {
  if (options.length > 0) {
    return options.map((option) => {
      return {
        value: option,
        label: _.startCase(option.name),
      };
    });
  }
};

const dropdown = (props) => {
  if (props.canCreateNewOptions) {
    return (
      <CreatableSelect
        styles={{
          control: (provided) => ({
            ...provided,
            color: "black",
            borderWidth: "1px",
            borderColor: !props.error ? "hsl(0, 0%, 80%)" : "red",
          }),
          option: (provided) => ({
            ...provided,
            color: "black",
          }),
        }}
        name={props.name}
        options={buildOptions(props.options)}
        isMulti
        onChange={props.handleSelect(props.optionName)}
      />
    );
  } else {
    return (
      <Select
        styles={{
          control: (provided) => ({
            ...provided,
            color: "black",
            borderWidth: "1px",
            borderColor: !props.error ? "hsl(0, 0%, 80%)" : "red",
          }),
          option: (provided) => ({
            ...provided,
            color: "black",
          }),
        }}
        name={props.name}
        options={buildOptions(props.options)}
        isMulti
        onChange={props.handleSelect(props.optionName)}
      />
    );
  }
};

const ListDropdown = (props) => {
  return dropdown(props);
};

export default React.memo(ListDropdown);
