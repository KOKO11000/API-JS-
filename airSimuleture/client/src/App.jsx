import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Aircrafts from "./pages/Aircrafts";
import Aircraft_type from "./pages/Aircraft_type";
import Flights from "./pages/Flights";
import Map from "./pages/Map";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <div className="app-shell">
      <div className="min-h-screen text-[var(--text-main)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aircrafts" element={<Aircrafts />} />
          <Route path="/aircraft-type" element={<Aircraft_type />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
