import React, { useState } from "react";
import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CarouselContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #ffffff;
  border: none;
  font-size: 20px;
  color: black;
  z-index: 1;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PreviousButton = styled(NavigationButton)`
  left: 10px;
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
`;

const CarouselImage = styled.img`
  width: 100%;
  max-width: 1200px;
`;

const Carousel = ({ thumbnails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? thumbnails.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === thumbnails.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <CarouselContainer>
      <PreviousButton onClick={goToPreviousSlide}>
        <FiChevronLeft color="#1E2124" />
      </PreviousButton>
      <NextButton onClick={goToNextSlide}>
        <FiChevronRight color="#1E2124" />
      </NextButton>
      <CarouselImage
        src={thumbnails[currentIndex].thumbnail}
        alt={`Thumbnail ${currentIndex + 1}`}
      />
    </CarouselContainer>
  );
};

export default Carousel;
