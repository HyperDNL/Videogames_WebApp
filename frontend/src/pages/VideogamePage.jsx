import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useVideogames } from "../context/videogamesContext";
import Carousel from "../components/Carousel";
import Loader from "../components/Loader";

const Container = styled.div`
  padding: 16px;
`;

const Title = styled.h1`
  font-size: 38px;
  margin: 16px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Section = styled.h4`
  margin: 0;
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

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const Genre = styled.li`
  margin: 0;
`;

const Year = styled.p`
  margin: 0;
`;

const Description = styled.p`
  margin: 0;
  text-align: justify;
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

const ParagraphContainer = styled.div`
  margin: 16px 0 16px 0;
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
          <Title>{title}</Title>
          <ParagraphContainer>
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
          </ParagraphContainer>
          <ParagraphContainer>
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
          </ParagraphContainer>
        </TextContainer>
      </ImageContainer>
      <ParagraphContainer>
        <Description>{description}</Description>
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
        <Year>
          Year: <LinkItem to={`/?searchBy=year&q=${year}`}>{year}</LinkItem>
        </Year>
      </ParagraphContainer>
      <CenteredCarouselContainer>
        <Carousel thumbnails={thumbnails} />
      </CenteredCarouselContainer>
    </Container>
  );
};

export default VideogamePage;
