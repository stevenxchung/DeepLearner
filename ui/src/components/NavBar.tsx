import { Link, useLocation } from "react-router-dom";

export const NavBar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="w-full bg-white border-b shadow px-4 py-2 mb-8 flex items-center gap-4">
      <Link
        to="/media"
        className={
          location.pathname.startsWith("/media")
            ? "font-bold text-blue-600"
            : ""
        }
      >
        📂 Media
      </Link>
      <Link
        to="/ai"
        className={
          location.pathname.startsWith("/ai") ? "font-bold text-green-600" : ""
        }
      >
        🤖 AI Agent
      </Link>
    </nav>
  );
};
