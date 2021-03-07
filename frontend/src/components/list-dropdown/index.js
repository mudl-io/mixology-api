import React from "react";
import Select from "react-select";

const buildOptions = (options) => {
  if (options.length > 0) {
    return options.map((option) => {
      return {
        value: option,
        label: option.name,
      };
    });
  }
};

const ListDropdown = (props) => {
  return (
    <Select
      styles={{
        control: (provided) => ({
          ...provided,
          color: "black",
          borderWidth: !props.error ? "0" : "2px",
          borderColor: !props.error ? "" : "red",
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
};

export default React.memo(ListDropdown);
