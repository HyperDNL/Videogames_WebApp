import React from "react";
import styled from "styled-components";

const DangerButtonField = styled.button`
  padding: 8px 16px;
  background-color: #ff3b30;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background-color: #ff5f55;
  }

  @media (min-width: 768px) {
    padding: 8px 12px;
    max-width: 200px;
  }
`;

const DangerButton = ({ type, onClick, children }) => {
  return (
    <DangerButtonField type={type} onClick={onClick}>
      {children}
    </DangerButtonField>
  );
};

export default DangerButton;
