import React from "react";
import styled from "styled-components";
import { useVideogames } from "../context/videogamesContext";
import Cover from "../components/Cover";

const CoverGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 16px;
  padding: 16px;
`;

const VideogamesPage = () => {
  const { videogames } = useVideogames();

  return (
    <CoverGrid>
      {videogames.map(({ _id, covers }) => (
        <Cover key={_id} id={_id} url={covers.cover.url} />
      ))}
    </CoverGrid>
  );
};

export default VideogamesPage;
