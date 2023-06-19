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
