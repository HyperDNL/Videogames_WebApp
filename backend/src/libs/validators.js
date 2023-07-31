export const validateStringField = (value) => {
  return typeof value === "string";
};

export const validateNumberField = (value) => {
  const numberValue = parseFloat(value);
  return !isNaN(numberValue) && typeof numberValue === "number";
};

export const validateArrayField = (value) => {
  return Array.isArray(value);
};

export const validateArrayElements = (array) => {
  return array.every((item) => validateStringField(item));
};

export const arraysAreEqual = (array1, array2) => {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};
