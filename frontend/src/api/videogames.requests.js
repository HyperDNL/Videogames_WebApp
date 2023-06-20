import axios from "axios";

export const createVideogameRequest = async (videogame) =>
  await axios.post(`http://localhost:4000/api/videogames`, videogame);

export const getVideogamesRequest = async () =>
  await axios.get(`http://localhost:4000/api/videogames`);

export const getVideogamesSortedRequest = async (field, order) =>
  await axios.get(
    `http://localhost:4000/api/videogames/sort?field=${field}&order=${order}`
  );

export const getVideogamesByQueryRequest = async (field, value) =>
  await axios.get(
    `http://localhost:4000/api/videogames/search?${field}=${value}`
  );

export const getVideogameRequest = async (id) =>
  await axios.get(`http://localhost:4000/api/videogames/${id}`);

export const updateVideogameRequest = async (id, newFields) =>
  await axios.put(`http://localhost:4000/api/videogames/${id}`, newFields);

export const deleteVideogameRequest = async (id) =>
  await axios.delete(`http://localhost:4000/api/videogames/${id}`);

export const deleteThumbnailRequest = async (idVideogame, idThumbnail) =>
  await axios.delete(
    `http://localhost:4000/api/videogames/${idVideogame}/thumbnails/${idThumbnail}`
  );
