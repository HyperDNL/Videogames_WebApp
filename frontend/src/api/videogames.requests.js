import axios from "axios";

export const createVideogameRequest = async (videogame) => {
  const { data } = await axios.post(
    `http://localhost:4000/api/videogames`,
    videogame
  );
  return data;
};

export const getVideogamesRequest = async () => {
  const { data } = await axios.get(`http://localhost:4000/api/videogames`);
  return data;
};

export const getVideogamesSortedRequest = async (field, order) => {
  const { data } = await axios.get(
    `http://localhost:4000/api/videogames/sort?field=${field}&order=${order}`
  );
  return data;
};

export const getVideogamesByQueryRequest = async (field, value) => {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/videogames/search?${field}=${value}`
    );
    return data;
  } catch (error) {
    if (error.response) {
      const { data } = error.response;
      throw new Error(data.message);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(
        `Error occurred while making the request: ${error.message}`
      );
    }
  }
};

export const getVideogameRequest = async (id) => {
  const { data } = await axios.get(
    `http://localhost:4000/api/videogames/${id}`
  );
  return data;
};

export const updateVideogameRequest = async (id, newFields) => {
  const { data } = await axios.put(
    `http://localhost:4000/api/videogames/${id}`,
    newFields
  );
  return data;
};

export const deleteVideogameRequest = async (id) => {
  const { status } = await axios.delete(
    `http://localhost:4000/api/videogames/${id}`
  );
  return status;
};

export const deleteThumbnailRequest = async (idVideogame, idThumbnail) => {
  const { status } = await axios.delete(
    `http://localhost:4000/api/videogames/${idVideogame}/thumbnails/${idThumbnail}`
  );
  return status;
};
