import React from "react";
import styled, { keyframes } from "styled-components";

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const CircleLoader = styled.div`
  border: ${({ borderWidth }) => borderWidth}px solid #ffffff;
  border-top: ${({ borderWidth }) => borderWidth}px solid #3b88c3;
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Loader = ({ size = 50, borderWidth = 4 }) => (
  <LoaderContainer>
    <CircleLoader size={size} borderWidth={borderWidth} />
  </LoaderContainer>
);

export default Loader;
