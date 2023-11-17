import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useVideogames } from "../context/videogamesContext";
import useFormHandlers from "../hooks/useFormHandlers";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Select from "../components/Select";
import Button from "../components/Button";
import SecondaryButton from "../components/SecondaryButton";
import Loader from "../components/Loader";

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

const SectionContainer = styled.div`
  margin: 16px 0 16px 0;
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

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
`;

const NotFoundMessage = styled.p`
  color: #ff3b30;
  font-size: 24px;
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const HomeLink = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  margin-top: 20px;
  display: block;
  padding: 8px 16px;
  background-color: #3b88c3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #5fa4d6;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 12px;
    max-width: 200px;
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

const UpdateVideogameFormPage = () => {
  const { getVideogame, updateVideogame } = useVideogames();

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [developers, setDevelopers] = useState([""]);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [year, setYear] = useState("");
  const [cover, setCover] = useState(null);
  const [landscape, setLandscape] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchVideogame = async () => {
      try {
        const data = await getVideogame(id);

        if (!data) {
          setNotFound(true);
        } else {
          setNotFound(false);

          const {
            title,
            description,
            developers,
            platforms,
            genres,
            year,
            covers,
            thumbnails,
          } = data;

          setTitle(title);
          setDescription(description);
          setDevelopers(developers.map(({ developer }) => developer));
          setPlatforms(platforms.map(({ platform }) => platform));
          setGenres(genres.map(({ genre }) => genre));
          setYear(year);
          setCover(covers.cover);
          setLandscape(covers.landscape);
          setThumbnails(thumbnails);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideogame();
  }, [getVideogame, id]);

  if (loading) {
    return (
      <CenteredLoaderContainer>
        <Loader />
      </CenteredLoaderContainer>
    );
  }

  if (notFound) {
    return (
      <NotFoundContainer>
        <NotFoundMessage>No Videogame</NotFoundMessage>
        <HomeLink to="/">Go back to Home</HomeLink>
      </NotFoundContainer>
    );
  }

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

    setSending(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("year", year);

    developers.map((developer) => {
      formData.append("developers", developer);
    });

    platforms.map((platform) => {
      formData.append("platforms", platform);
    });

    genres.map((genre) => {
      formData.append("genres", genre);
    });

    formData.append("cover", cover);
    formData.append("landscape", landscape);

    thumbnails.map((thumbnail) => {
      formData.append("thumbnails", thumbnail);
    });

    try {
      await updateVideogame(id, formData);
    } finally {
      setSending(false);
    }
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
            <TextArea
              placeholder="Videogame description"
              rows={4}
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
            <Button type="submit" disabled={sending}>
              {sending ? "Sending" : "Update"}
            </Button>
          </ButtonContainer>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default UpdateVideogameFormPage;
