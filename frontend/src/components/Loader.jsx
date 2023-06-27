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
  border: 4px solid #ffffff;
  border-top: 4px solid #3b88c3;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Loader = () => (
  <LoaderContainer>
    <CircleLoader />
  </LoaderContainer>
);

export default Loader;
