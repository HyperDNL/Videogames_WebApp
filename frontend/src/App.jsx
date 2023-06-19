import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideogamesPage from "./pages/VideogamesPage";
import VideogamePage from "./pages/VideogamePage";
import CreateVideogameFormPage from "./pages/CreateVideogameFormPage";
import UpdateVideogameFormPage from "./pages/UpdateVideogameFormPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";

const App = () => {
  const routes = [
    { name: "Home", route: "/" },
    { name: "Add Videogame", route: "/videogames/add-videogame" },
  ];

  return (
    <BrowserRouter>
      <Navbar routes={routes} />
      <Routes>
        <Route path="/" element={<VideogamesPage />} />
        <Route path="/videogames/:id" element={<VideogamePage />} />
        <Route
          path="/videogames/add-videogame"
          element={<CreateVideogameFormPage />}
        />
        <Route
          path="/videogames/update-videoogame/:id"
          element={<UpdateVideogameFormPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
