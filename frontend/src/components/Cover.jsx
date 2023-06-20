import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CoverContainer = styled.div`
  position: relative;
  display: inline-block;
  max-width: 1000px;
  max-height: 1000px;
  overflow: hidden;
  cursor: pointer;
`;

const CoverImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;

  ${CoverContainer}:hover & {
    transform: scale(1.1);
  }
`;

const CoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Cover = ({ id, url }) => {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <CoverContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/videogames/${id}`)}
    >
      <CoverImage src={url} alt="Cover" />
      {isHovered && <CoverOverlay />}
    </CoverContainer>
  );
};

export default Cover;
