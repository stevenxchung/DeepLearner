import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { ChatPage } from "./pages/ChatPage";
import { MediaPage } from "./pages/MediaPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/media" />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/ai" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
