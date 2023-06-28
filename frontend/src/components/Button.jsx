import React from "react";
import styled from "styled-components";

const ButtonField = styled.button`
  padding: 8px 16px;
  background-color: #3b88c3;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background-color: #5fa4d6;
  }

  @media (min-width: 768px) {
    padding: 8px 12px;
    max-width: 200px;
  }
`;

const Button = ({ type, onClick, children }) => {
  return (
    <ButtonField type={type} onClick={onClick}>
      {children}
    </ButtonField>
  );
};

export default Button;
