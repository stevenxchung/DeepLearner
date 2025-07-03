import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";
import { ChatProvider } from "./context/ChatContext.tsx";
import { FileProvider } from "./context/FileContext.tsx";
import { JobProvider } from "./context/JobContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChatProvider>
      <FileProvider>
        <JobProvider>
          <App />
        </JobProvider>
      </FileProvider>
    </ChatProvider>
  </StrictMode>
);
