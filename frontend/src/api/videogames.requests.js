import axios from "axios";

export const createVideogameRequest = async (videogame) => {
  try {
    const { data } = await axios.post(
      `http://localhost:4000/api/videogames`,
      videogame
    );
    return data;
  } catch (error) {
    if (error.response) {
      const { response } = error;
      const { data } = response;
      if (data.errors) {
        throw data.errors;
      } else if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Error: ${error.message}`);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(
        `Error occurred while making the request: ${error.message}`
      );
    }
  }
};

export const getVideogamesRequest = async () => {
  try {
    const { data } = await axios.get(`http://localhost:4000/api/videogames`);
    return data;
  } catch (error) {
    if (error.response) {
      const { data } = error.response;
      if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Error: ${error.message}`);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(
        `Error occurred while making the request: ${error.message}`
      );
    }
  }
};

export const getVideogamesSortedRequest = async (field, order) => {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/videogames/sort?field=${field}&order=${order}`
    );
    return data;
  } catch (error) {
    if (error.response) {
      const { data } = error.response;
      if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Error: ${error.message}`);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(
        `Error occurred while making the request: ${error.message}`
      );
    }
  }
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
      if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Error: ${error.message}`);
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
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/videogames/${id}`
    );
    return data;
  } catch (error) {
    if (error.response) {
      const { response } = error;
      const { data } = response;
      if (data.errors) {
        throw data.errors;
      } else if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Error: ${error.message}`);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(
        `Error occurred while making the request: ${error.message}`
      );
    }
  }
};

export const updateVideogameRequest = async (id, newFields) => {
  try {
    const { data } = await axios.put(
      `http://localhost:4000/api/videogames/${id}`,
      newFields
    );
    return data;
  } catch (error) {
    if (error.response) {
      const { data } = error.response;
      if (data.errors) {
        throw data.errors;
      } else if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Error: ${error.message}`);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(
        `Error occurred while making the request: ${error.message}`
      );
    }
  }
};

export const deleteVideogameRequest = async (id) => {
  try {
    const { status } = await axios.delete(
      `http://localhost:4000/api/videogames/${id}`
    );
    return status;
  } catch (error) {
    if (error.response) {
      const { response } = error;
      const { data } = response;
      if (data.errors) {
        throw data.errors;
      } else if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Error: ${error.message}`);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(
        `Error occurred while making the request: ${error.message}`
      );
    }
  }
};

export const deleteThumbnailRequest = async (idVideogame, idThumbnail) => {
  try {
    const res = await axios.delete(
      `http://localhost:4000/api/videogames/${idVideogame}/thumbnails/${idThumbnail}`
    );
    return res;
  } catch (error) {
    if (error.response) {
      const { response } = error;
      const { data } = response;
      if (data.errors) {
        throw data.errors;
      } else if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Error: ${error.message}`);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(
        `Error occurred while making the request: ${error.message}`
      );
    }
  }
};
