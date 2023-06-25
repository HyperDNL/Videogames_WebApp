import React from "react";
import styled from "styled-components";

const SecondaryButtonField = styled.button`
  padding: 8px 16px;
  background-color: #707b7c;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background-color: #95a0a1;
  }

  @media (min-width: 768px) {
    padding: 8px 12px;
    max-width: 200px;
  }
`;

const SecondaryButton = ({ type, onClick, children }) => {
  return (
    <SecondaryButtonField type={type} onClick={onClick}>
      {children}
    </SecondaryButtonField>
  );
};

export default SecondaryButton;
