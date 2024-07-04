// import { useEffect } from "react";
// import styles from "./slider.module.css";
// import "./slider.css";

// const Slider = () => {
//   useEffect(() => {
//     const range = document.getElementById("range");

//     // Function to map a range of numbers to another range
//     const scale = (num, in_min, in_max, out_min, out_max) => {
//       return (
//         ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
//       );
//     };

//     range.addEventListener("input", (e) => {
//       const value = +e.target.value;
//       const label = e.target.nextElementSibling;
//       const rangeWidth = window
//         .getComputedStyle(e.target)
//         .getPropertyValue("width");
//       const labelWidth = window
//         .getComputedStyle(label)
//         .getPropertyValue("width");
//       const numWidth = +rangeWidth.substring(0, rangeWidth.length - 2);
//       const numLabelWidth = +labelWidth.substring(0, labelWidth.length - 2);
//       const max = +e.target.max;
//       const min = +e.target.min;
//       const left =
//         value * (numWidth / max) -
//         numLabelWidth / 2 +
//         scale(value, min, max, 10, -10);
//       label.style.left = `${left}px`;
//       label.innerHTML = value;
//     });

//     // Clean up event listener on component unmount
//     return () => {
//       range.removeEventListener("input");
//     };
//   }, []);

//   return (
//     <div className="range-container">
//       <input type="range" name="range" id="range" min="0" max="100" />
//       <label for="range">50</label>
//     </div>
//   );
// };

// export default Slider;

import { useState, useEffect } from "react";
import styles from "./slider.module.css";
import "./slider.css";

const Slider = (minV, maxV) => {
  const [value, setValue] = useState(50); // Initialize state with initial slider value

  useEffect(() => {
    const range = document.getElementById("range");

    // Function to map a range of numbers to another range
    const scale = (num, in_min, in_max, out_min, out_max) => {
      return (
        ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      );
    };

    const handleInput = (e) => {
      const value = +e.target.value;
      setValue(value); // Update state with the slider value
      const label = e.target.nextElementSibling;
      const rangeWidth = window
        .getComputedStyle(e.target)
        .getPropertyValue("width");
      const labelWidth = window
        .getComputedStyle(label)
        .getPropertyValue("width");
      const numWidth = +rangeWidth.substring(0, rangeWidth.length - 2);
      const numLabelWidth = +labelWidth.substring(0, labelWidth.length - 2);
      const max = +e.target.max;
      const min = +e.target.min;
      const left =
        value * (numWidth / max) -
        numLabelWidth / 2 +
        scale(value, min, max, 10, -10);
      label.style.left = `${left}px`;
      label.innerHTML = value;
    };

    range.addEventListener("input", handleInput);

    // Clean up event listener on component unmount
    return () => {
      range.removeEventListener("input", handleInput);
    };
  }, []);

  return (
    <div className="range-container">
      <input
        type="range"
        name="range"
        id="range"
        min={minV}
        max={maxV}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <label htmlFor="range">{value}</label>
    </div>
  );
};

export default Slider;
