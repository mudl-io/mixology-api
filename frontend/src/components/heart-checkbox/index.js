import React from "react";
import { IconContext } from "react-icons";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

const heart = (isChecked) => {
  return (
    <IconContext.Provider value={{ color: "red" }}>
      <div>
        {isChecked ? <IoMdHeart size={20} /> : <IoMdHeartEmpty size={20} />}
      </div>
    </IconContext.Provider>
  );
};

const HeartCheckbox = (props) => {
  return <div onClick={props.handleClick}>{heart(props.isChecked)}</div>;
};

export default HeartCheckbox;
