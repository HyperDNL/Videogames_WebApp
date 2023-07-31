import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useVideogames } from "../context/videogamesContext";
import Carousel from "../components/Carousel";
import Loader from "../components/Loader";

const Container = styled.div`
  padding: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 38px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.h2`
  margin: 0;
  font-size: 28px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Section = styled.h4`
  margin: 0;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Developer = styled.li`
  font-size: 26px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Platform = styled.li`
  border: 1px solid #ffffff;
  border-radius: 5px;
  padding: 5px;
  margin: 0;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const Genre = styled.li`
  margin: 0;
  text-align: left;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const InfoText = styled.p`
  margin: 0;
  text-align: left;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const BoldText = styled.span`
  font-weight: bold;
`;

const LinkItem = styled(Link)`
  text-decoration: none;
  color: #ffffff;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const DeveloperList = styled(List)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PlatformList = styled(List)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const GenreList = styled(List)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Image = styled.img`
  height: 60vh;
  width: 100%;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 40vh;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
`;

const TextContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  text-align: center;
`;

const SectionContainer = styled.div`
  margin: 16px;
`;

const InfoContainer = styled.div`
  background-color: #24282b;
  padding: 8px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px #131619;

  @media (max-width: 768px) {
    padding: 4px;
  }
`;

const ParagraphContainer = styled.div`
  margin: 8px;

  @media (max-width: 768px) {
    padding: 4px;
  }
`;

const CarouselContainer = styled.div`
  background-color: #131619;
  box-shadow: 0px 0px 10px #131619;
`;

const CenteredCarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenteredLoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
`;

const VideogamePage = () => {
  const { id } = useParams();
  const { getVideogame } = useVideogames();
  const [videogame, setVideogame] = useState(null);

  useEffect(() => {
    const fetchVideogame = async () => {
      const data = await getVideogame(id);
      setVideogame(data);
    };

    fetchVideogame();
  }, [getVideogame, id]);

  if (!videogame) {
    return (
      <CenteredLoaderContainer>
        <Loader />
      </CenteredLoaderContainer>
    );
  }

  const transformString = (string) => {
    let toLower = string.toLowerCase();
    let newString = toLower.replace(/ /g, "+");
    return newString;
  };

  const {
    title,
    description,
    developers,
    platforms,
    genres,
    year,
    covers,
    thumbnails,
  } = videogame;

  return (
    <Container>
      <ImageContainer>
        <Image src={covers.landscape.url} alt="Landscape" />
        <Overlay />
        <TextContainer>
          <SectionContainer>
            <Title>{title}</Title>
          </SectionContainer>
          <SectionContainer>
            <DeveloperList>
              {developers.map(({ developer }, index) => (
                <Developer key={index}>
                  <LinkItem
                    to={`/?searchBy=developer&q=${transformString(developer)}`}
                  >
                    {developer}
                  </LinkItem>
                </Developer>
              ))}
            </DeveloperList>
          </SectionContainer>
          <SectionContainer>
            <PlatformList>
              {platforms.map(({ platform }, index) => (
                <Platform key={index}>
                  <LinkItem
                    to={`/?searchBy=platform&q=${transformString(platform)}`}
                  >
                    {platform}
                  </LinkItem>
                </Platform>
              ))}
            </PlatformList>
          </SectionContainer>
        </TextContainer>
      </ImageContainer>
      <SectionContainer>
        <Subtitle>Game Information</Subtitle>
      </SectionContainer>
      <SectionContainer>
        <InfoContainer>
          <ParagraphContainer>
            <InfoText>{description}</InfoText>
          </ParagraphContainer>
          <ParagraphContainer>
            <Section>Genre (s):</Section>
            <GenreList>
              {genres.map(({ genre }, index) => (
                <Genre key={index}>
                  <LinkItem to={`/?searchBy=genre&q=${transformString(genre)}`}>
                    {genre}
                  </LinkItem>
                </Genre>
              ))}
            </GenreList>
          </ParagraphContainer>
          <ParagraphContainer>
            <InfoText>
              <BoldText>Release year: </BoldText>
              <LinkItem to={`/?searchBy=year&q=${year}`}>{year}</LinkItem>
            </InfoText>
          </ParagraphContainer>
        </InfoContainer>
      </SectionContainer>
      {thumbnails.length > 0 && (
        <>
          <SectionContainer>
            <Subtitle>Thumbnails</Subtitle>
          </SectionContainer>
          <SectionContainer>
            <CenteredCarouselContainer>
              <CarouselContainer>
                <Carousel thumbnails={thumbnails} />
              </CarouselContainer>
            </CenteredCarouselContainer>
          </SectionContainer>
        </>
      )}
    </Container>
  );
};

export default VideogamePage;
