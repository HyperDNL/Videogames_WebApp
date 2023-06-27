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
import { ToastError, ToastSuccess } from "../resources/ToastMessages";

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
      ToastSuccess("successfullyCreated", "Videogame created successfully");
    } catch (error) {
      if (Array.isArray(error)) {
        error.map(({ error }, i) => ToastError(i, error));
      } else {
        ToastError("failedToCreate", error.message);
      }
    }
  };

  const getVideogames = async () => {
    try {
      const data = await getVideogamesRequest();
      setVideogames(data);
    } catch (error) {
      ToastError("errorGetVideogames", error.message);
    }
  };

  const getVideogamesSorted = async (field, order) => {
    try {
      const data = await getVideogamesSortedRequest(field, order);
      setVideogames(data);
    } catch (error) {
      ToastError("errorGetVideogamesSorted", error.message);
    }
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
    try {
      const data = await getVideogameRequest(id);
      return data;
    } catch (error) {
      ToastError("errorGetVideogame", error.message);
    }
  };

  const updateVideogame = async (id, newFields) => {
    try {
      const data = await updateVideogameRequest(id, newFields);
      setVideogames(
        videogames.map((videogame) => (videogame._id === id ? data : videogame))
      );
    } catch (error) {
      if (Array.isArray(error)) {
        error.map(({ error }, i) => ToastError(i, error));
      } else {
        ToastError("failedToUpdate", error.message);
      }
    }
  };

  const deleteVideogame = async (id) => {
    try {
      const status = await deleteVideogameRequest(id);
      if (status === 204) {
        setVideogames(videogames.filter(({ _id }) => _id !== id));
      }
    } catch (error) {
      ToastError("failedToDeleteVideogame", error.message);
    }
  };

  const deleteThumbnail = async (idVideogame, idThumbnail) => {
    try {
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
    } catch (error) {
      ToastError("failedToDeleteThumbnail", error.message);
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
