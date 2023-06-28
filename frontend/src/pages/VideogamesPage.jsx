import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useVideogames } from "../context/videogamesContext";
import Cover from "../components/Cover";

const CoverGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, max-content));
  grid-gap: 16px;
  margin: 16px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 481px) and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1025px) and (max-width: 1200px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 16px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #3b88c3;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  width: 100%;
  margin-bottom: 8px;
  background-color: #24282b;
  color: #a8acaf;
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: #5fa4d6;
    outline: none;
  }

  @media (min-width: 768px) {
    max-width: 140px;
    margin-bottom: 0;
    margin-right: 8px;
  }
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #3b88c3;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  width: 100%;
  margin-bottom: 8px;
  background-color: #24282b;
  color: #a8acaf;
  transition: border-color 0.3s ease-in-out;
  box-sizing: border-box;

  &:focus {
    border-color: #5fa4d6;
    outline: none;
  }

  &::placeholder {
    color: #a8acaf;
  }

  @media (min-width: 768px) {
    max-width: 500px;
    margin-bottom: 0;
    margin-right: 8px;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #3b88c3;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background-color: #5fa4d6;
  }

  @media (min-width: 768px) {
    padding: 8px 12px;
    max-width: 140px;
  }
`;

const NotFoundMessage = styled.p`
  color: #ff3b30;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const VideogamesPage = () => {
  const { videogames, getVideogames, getVideogamesByQuery } = useVideogames();

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchBy = searchParams.get("searchBy");
  const searchQuery = searchParams.get("q");

  const searchByOptions = ["title", "developer", "platform", "genre", "year"];

  const [field, setField] = useState(
    searchByOptions.includes(searchBy) ? searchBy : searchByOptions[0]
  );
  const [query, setQuery] = useState(searchQuery || "");

  useEffect(() => {
    if (searchQuery && searchBy) {
      if (!searchByOptions.includes(searchBy)) {
        setField(searchByOptions[0]);
      }
      getVideogamesByQuery(searchBy, searchQuery);
    } else {
      getVideogames();
    }
  }, [searchBy, searchQuery]);

  const handleSearch = () => {
    updateURLSearchParams(field, query);
  };

  const handleSearchBy = (event) => {
    const searchByValue = event.target.value;
    setField(searchByValue);
  };

  const updateURLSearchParams = (field, query) => {
    const searchParams = new URLSearchParams();

    if (field) searchParams.set("searchBy", field);
    if (query) searchParams.set("q", query);

    const newPath = `${location.pathname}?${searchParams.toString()}`;
    navigate(newPath);
  };

  return (
    <>
      <FormContainer>
        <Select onChange={handleSearchBy} value={field}>
          {searchByOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <Button onClick={handleSearch}>Search</Button>
      </FormContainer>
      {videogames.length === 0 ? (
        <NotFoundMessage>There are no Videogames</NotFoundMessage>
      ) : (
        <CoverGrid>
          {videogames.map(({ _id, covers }) => (
            <Cover key={_id} id={_id} url={covers.cover.url} />
          ))}
        </CoverGrid>
      )}
    </>
  );
};

export default VideogamesPage;
