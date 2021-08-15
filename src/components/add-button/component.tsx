import { useState } from "react";
import PropTypes from "prop-types";
import style from "./style.module.css";

const AddButton = ({ popupHandler }: any) => {
  // const { popupHandler } = props;

  return (
    <div className={style.add_button} onClick={popupHandler}>
      +
    </div>
  );
};

AddButton.propTypes = {
  popupHandler: PropTypes.func.isRequired,
};

export default AddButton;
