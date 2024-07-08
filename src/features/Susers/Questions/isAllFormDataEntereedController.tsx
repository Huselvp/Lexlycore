let isThereData = false;

export const isThereDataHandler = (value1, value2) => {
  if (value1 === value2) {
    isThereData = true;
  } else {
    isThereData = false;
  }
};

export { isThereData };
