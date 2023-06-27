import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useVideogames } from "../context/videogamesContext";
import Carousel from "../components/Carousel";
import Loader from "../components/Loader";

const Container = styled.div`
  padding: 16px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
`;

const Image = styled.img`
  max-width: 100%;
  margin-bottom: 10px;
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

const VideogameDetailsPage = () => {
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

  return (
    <Container>
      <div>
        <div>
          <Image src={videogame.covers.landscape.url} alt="Landscape" />
        </div>
      </div>
      <Title>{videogame.title}</Title>
      <Description>{videogame.description}</Description>
      <div>
        <h4>Developer (s):</h4>
        <List>
          {videogame.developers.map((developer, index) => (
            <ListItem key={index}>{developer.developer}</ListItem>
          ))}
        </List>
      </div>
      <div>
        <h4>Platform (s):</h4>
        <List>
          {videogame.platforms.map((platform, index) => (
            <ListItem key={index}>{platform.platform}</ListItem>
          ))}
        </List>
      </div>
      <div>
        <h4>Genre (s):</h4>
        <List>
          {videogame.genres.map((genre, index) => (
            <ListItem key={index}>{genre.genre}</ListItem>
          ))}
        </List>
      </div>
      <p>Year: {videogame.year}</p>
      <div>
        <h4>Thumbnails:</h4>
        <CenteredCarouselContainer>
          <Carousel thumbnails={videogame.thumbnails} />
        </CenteredCarouselContainer>
      </div>
    </Container>
  );
};

export default VideogameDetailsPage;
