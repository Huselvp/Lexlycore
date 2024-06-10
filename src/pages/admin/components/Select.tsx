import React, { useState, useEffect } from "react";
import { getApiConfig } from "../../../utils/constants";
import axios from "axios";

function Select(props) {
  const [optios, setOptions] = useState({});

  useEffect(() => {
    const getOptions = async (id) => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/form/block/label/options/${id}`,
          getApiConfig()
        );

        setOptions(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (props.id) {
      getOptions(props.id);
    }
  }, [props.id]);

  // this is the function that add the option to the input
  const select_type_handler = async (id) => {
    try {
      await axios
        .post(
          `http://localhost:8081/api/form/block/label/options/${id}`,
          choices,
          getApiConfig()
        )
        .then((result) => {
          console.log(result);
          setIsAddOptionsOpen(false);
          setIsPopUpOpen(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <form>
        <label>{props.label}</label>
        <select name="cars" id="cars">
          {Object.keys(optios).length !== 0 &&
            Object.entries(optios).map(([key, option]) => (
              <option value={option}>{option}</option>
            ))}
        </select>
        <button
          type="button"
          //   onClick={() => {
          //     setIsAddOptionsOpen(true);
          //     setIsPopUpOpen(true);

          //     console.log(id);
          //     setSelectInputId(id);
          //   }}
        >
          Click to enter your options
        </button>
      </form>
    </React.Fragment>
  );
}

export default Select;
