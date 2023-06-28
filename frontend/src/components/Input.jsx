import React from "react";
import styled from "styled-components";

const InputField = styled.input`
  padding: 8px;
  border: 1px solid #3b88c3;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  width: 100%;
  margin-bottom: 8px;
  background-color: #24282b;
  color: #a8acaf;
  transition: border-color 0.3s ease-in-out;
  box-sizing: border-box;

  &:focus {
    border-color: #5fa4d6;
    outline: none;
  }

  &::placeholder {
    color: #a8acaf;
  }
`;

const Input = ({ type, placeholder, multiple, value, onChange }) => {
  return (
    <InputField
      type={type}
      placeholder={placeholder}
      multiple={multiple}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
