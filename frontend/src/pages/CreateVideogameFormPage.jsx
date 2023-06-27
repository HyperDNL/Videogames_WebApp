import React, { useState } from "react";
import styled from "styled-components";
import { useVideogames } from "../context/videogamesContext";
import useFormHandlers from "../hooks/useFormHandlers";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import SecondaryButton from "../components/SecondaryButton";
import DangerButton from "../components/DangerButton";

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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: 767px) {
    & > * {
      margin-bottom: 8px;
    }
  }
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
  "Xbox Series",
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

  const {
    handleAddInput,
    handleSingleInputChange,
    handleMultipleInputChange,
    handleFileChange,
    handleFilesChange,
    handleSelectChange,
  } = useFormHandlers();

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

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDevelopers([""]);
    setPlatforms([]);
    setGenres([]);
    setYear("");
    setCover(null);
    setLandscape(null);
    setThumbnails([]);
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
              onChange={(e) => handleSingleInputChange(setTitle, e)}
            />
          </Label>

          <Label>
            <span>Description:</span>
            <Input
              type="text"
              placeholder="Videogame description"
              value={description}
              onChange={(e) => handleSingleInputChange(setDescription, e)}
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
                onChange={(e) =>
                  handleMultipleInputChange(index, setDevelopers, e)
                }
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
            <Select
              multiple
              value={platforms}
              onChange={(e) => handleSelectChange(setPlatforms, e)}
              options={platformsOptions}
            />
          </Label>

          <Label>
            <span>Genres:</span>
            <Select
              multiple
              value={genres}
              onChange={(e) => handleSelectChange(setGenres, e)}
              options={genreOptions}
            />
          </Label>

          <Label>
            <span>Year:</span>
            <Input
              type="text"
              placeholder="Release year"
              value={year}
              onChange={(e) => handleSingleInputChange(setYear, e)}
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
            <Input
              type="file"
              multiple
              onChange={(e) => handleFilesChange(setThumbnails, e)}
            />
          </Label>

          <ButtonContainer>
            <Button type="submit">Create</Button>
            <DangerButton type="button" onClick={handleReset}>
              Reset
            </DangerButton>
          </ButtonContainer>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default CreateVideogameFormPage;
