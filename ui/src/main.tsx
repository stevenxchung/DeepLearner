import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { FileProvider } from "./context/FileContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <FileProvider>
        <App />
      </FileProvider>
    </AppProvider>
  </StrictMode>
);
