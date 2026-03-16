import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayerPage from "./pages/PlayerPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayerPage />} />
      </Routes>
    </Router>
  );
}
