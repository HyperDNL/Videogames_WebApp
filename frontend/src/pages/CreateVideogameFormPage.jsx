import React, { useState } from "react";
import styled from "styled-components";
import { useVideogames } from "../context/videogamesContext";

const Input = styled.input`
  padding: 8px;
  border: 1px solid #3b88c3;
  border-radius: 4px;
  font-size: 16px;
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
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #3b88c3;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background-color: #5fa4d6;
  }

  @media (min-width: 768px) {
    padding: 8px 12px;
    max-width: 200px;
  }
`;

const SecondaryButton = styled.button`
  padding: 8px 16px;
  background-color: #707b7c;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background-color: #95a0a1;
  }

  @media (min-width: 768px) {
    padding: 8px 12px;
    max-width: 200px;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
  }
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #3b88c3;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 8px;
  background-color: #24282b;
  color: #a8acaf;
  transition: border-color 0.3s ease-in-out;
  box-sizing: border-box;
  height: auto;

  &:focus {
    border-color: #5fa4d6;
    outline: none;
  }
`;

const Option = styled.option`
  color: #a8acaf;
`;

const Container = styled.div`
  margin: 16px;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
`;

const platformsOptions = [
  "PS1",
  "PS2",
  "PS3",
  "PS4",
  "PS5",
  "PSP",
  "PS Vita",
  "Xbox",
  "Xbox 360",
  "Xbox One",
  "Xbox Series X|S",
  "Wii",
  "Wii U",
  "Nintendo DS",
  "Nintendo DSi",
  "Nintendo 2D",
  "Nintendo 3DS",
  "Nintendo Switch",
  "Amazon Luna",
  "PC",
];

const genreOptions = [
  "Acción",
  "Arcade",
  "Aventura",
  "Carreras",
  "Deporte",
  "Disparos",
  "Estrategia",
  "Plataformas",
  "Puzzle",
  "RPG",
  "Sandbox",
  "Simulación",
  "Supervivencia",
  "Terror",
];

const CreateVideogameFormPage = () => {
  const { createVideogame } = useVideogames();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [developers, setDevelopers] = useState([""]);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [year, setYear] = useState("");
  const [cover, setCover] = useState(null);
  const [landscape, setLandscape] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("year", year);

    developers.forEach((developer) => {
      formData.append("developers", developer);
    });

    platforms.forEach((platform) => {
      formData.append("platforms", platform);
    });

    genres.forEach((genre) => {
      formData.append("genres", genre);
    });

    formData.append("cover", cover);
    formData.append("landscape", landscape);

    thumbnails.forEach((thumbnail) => {
      formData.append("thumbnails", thumbnail);
    });

    try {
      await createVideogame(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddInput = (setState) => {
    setState((prev) => [...prev, ""]);
  };

  const handleInputChange = (index, setState, e) => {
    const value = e.target.value;
    setState((prev) => {
      const newState = [...prev];
      newState[index] = value;
      return newState;
    });
  };

  const handleFileChange = (setState, e) => {
    const file = e.target.files[0];
    setState(file);
  };

  const handleThumbnailChange = (e) => {
    const files = Array.from(e.target.files);
    setThumbnails(files);
  };

  const handlePlatformChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setPlatforms(selectedValues);
  };

  const handleGenreChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setGenres(selectedValues);
  };

  return (
    <Container>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Label>
            <span>Title:</span>
            <Input
              type="text"
              placeholder="Videogame title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Label>

          <Label>
            <span>Description:</span>
            <Input
              type="text"
              placeholder="Videogame description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Label>

          <Label>
            <span>Developers:</span>
            {developers.map((developer, index) => (
              <Input
                key={index}
                type="text"
                placeholder="Developer"
                value={developer}
                onChange={(e) => handleInputChange(index, setDevelopers, e)}
              />
            ))}
            <SecondaryButton
              type="button"
              onClick={() => handleAddInput(setDevelopers)}
            >
              Add Developer
            </SecondaryButton>
          </Label>

          <Label>
            <span>Platforms:</span>
            <Select multiple value={platforms} onChange={handlePlatformChange}>
              {platformsOptions.map((platform) => (
                <Option key={platform} value={platform}>
                  {platform}
                </Option>
              ))}
            </Select>
          </Label>

          <Label>
            <span>Genres:</span>
            <Select multiple value={genres} onChange={handleGenreChange}>
              {genreOptions.map((genre) => (
                <Option key={genre} value={genre}>
                  {genre}
                </Option>
              ))}
            </Select>
          </Label>

          <Label>
            <span>Year:</span>
            <Input
              type="text"
              placeholder="Release year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Label>

          <Label>
            <span>Cover:</span>
            <Input
              type="file"
              onChange={(e) => handleFileChange(setCover, e)}
            />
          </Label>

          <Label>
            <span>Landscape:</span>
            <Input
              type="file"
              onChange={(e) => handleFileChange(setLandscape, e)}
            />
          </Label>

          <Label>
            <span>Thumbnails:</span>
            <Input type="file" multiple onChange={handleThumbnailChange} />
          </Label>

          <Button type="submit">Create</Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default CreateVideogameFormPage;
