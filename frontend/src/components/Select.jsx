import React from "react";
import styled from "styled-components";

const SelectField = styled.select`
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
  height: auto;

  &:focus {
    border-color: #5fa4d6;
    outline: none;
  }
`;

const Option = styled.option`
  color: #a8acaf;
`;

const Select = ({ multiple, value, onChange, options }) => {
  return (
    <SelectField multiple={multiple} value={value} onChange={onChange}>
      {options.map((option) => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </SelectField>
  );
};

export default Select;
