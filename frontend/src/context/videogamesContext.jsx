import { createContext, useContext, useState } from "react";
import {
  createVideogameRequest,
  getVideogamesRequest,
  getVideogamesSortedRequest,
  getVideogamesByQueryRequest,
  getVideogameRequest,
  updateVideogameRequest,
  deleteVideogameRequest,
  deleteThumbnailRequest,
} from "../api/videogames.requests";
import { ToastError } from "../resources/ToastMessages";

const videogamesContext = createContext();

export const useVideogames = () => {
  const context = useContext(videogamesContext);

  if (!context)
    throw new Error("useVideogames must be used within a VideogameProvider");

  return context;
};

export const VideogameProvider = ({ children }) => {
  const [videogames, setVideogames] = useState([]);

  const createVideogame = async (videogame) => {
    try {
      const data = await createVideogameRequest(videogame);
      setVideogames([...videogames, data]);
    } catch (error) {
      if (Array.isArray(error)) {
        error.map(({ error }, i) => ToastError(i, error));
      } else {
        ToastError("errorCreate", error.message);
      }
    }
  };

  const getVideogames = async () => {
    const data = await getVideogamesRequest();
    setVideogames(data);
  };

  const getVideogamesSorted = async (field, order) => {
    const data = await getVideogamesSortedRequest(field, order);
    setVideogames(data);
  };

  const getVideogamesByQuery = async (field, value) => {
    try {
      const data = await getVideogamesByQueryRequest(field, value);
      setVideogames(data);
    } catch (error) {
      ToastError("errorGetByQuery", error.message);
    }
  };

  const getVideogame = async (id) => {
    const data = await getVideogameRequest(id);
    return data;
  };

  const updateVideogame = async (id, newFields) => {
    const data = await updateVideogameRequest(id, newFields);
    setVideogames(
      videogames.map((videogame) => (videogame._id === id ? data : videogame))
    );
  };

  const deleteVideogame = async (id) => {
    const status = await deleteVideogameRequest(id);
    if (status === 204) {
      setVideogames(videogames.filter(({ _id }) => _id !== id));
    }
  };

  const deleteThumbnail = async (idVideogame, idThumbnail) => {
    const status = await deleteThumbnailRequest(idVideogame, idThumbnail);
    if (status === 204) {
      setVideogames((videogames) =>
        videogames.map((videogame) =>
          videogame._id === idVideogame
            ? {
                ...videogame,
                thumbnails: videogame.thumbnails.filter(
                  (thumbnail) => thumbnail._id !== idThumbnail
                ),
              }
            : videogame
        )
      );
    }
  };

  return (
    <videogamesContext.Provider
      value={{
        videogames,
        createVideogame,
        getVideogames,
        getVideogamesSorted,
        getVideogamesByQuery,
        getVideogame,
        updateVideogame,
        deleteVideogame,
        deleteThumbnail,
      }}
    >
      {children}
    </videogamesContext.Provider>
  );
};
