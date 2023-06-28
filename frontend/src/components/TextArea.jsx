import React from "react";
import styled from "styled-components";

const TextareaField = styled.textarea`
  padding: 8px;
  border: 1px solid #3b88c3;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  width: 100%;
  margin-bottom: 8px;
  background-color: #24282b;
  color: #a8acaf;
  resize: vertical;
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

const TextArea = ({ placeholder, rows, value, onChange }) => {
  return (
    <TextareaField
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextArea;
