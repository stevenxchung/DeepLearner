import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { ChatPage } from "./pages/ChatPage";
import { MediaPage } from "./pages/MediaPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-[#FDFEFF]">
        <Sidebar />
        <main className="flex flex-col flex-1 h-screen relative bg-[#FDFEFF] ">
          <Routes>
            <Route path="/" element={<Navigate to="/media" />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/ai" element={<ChatPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
