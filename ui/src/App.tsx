import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { useAudioJob } from "./hooks/useAudioJob";
import { useProgressLoader } from "./hooks/useProgressLoader";
import { ActionButton } from "./components/ActionButton";
import { ReactiveInput } from "./components/ReactiveInput";

function App() {
  const [url, setUrl] = useState("");
  const { loading, audioFile, error, startAudioJob } = useAudioJob();
  const progress = useProgressLoader(loading, !!error);

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", textAlign: "center" }}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>

        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Video Audio Extractor</h1>

      <div style={{ width: "84%", margin: "28px auto 0 auto" }}>
        <ReactiveInput
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste URL here"
          progress={progress}
          loading={loading}
          error={!!error}
          autoComplete="off"
        />
      </div>

      <div style={{ marginTop: 28 }}>
        <ActionButton
          loading={loading}
          error={!!error}
          disabled={!url || loading}
          onClick={() => startAudioJob(url)}
        />
      </div>

      {audioFile && (
        <div style={{ marginTop: "2rem" }}>
          <a href={audioFile} download>
            Download Extracted Audio
          </a>
        </div>
      )}

      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
    </div>
  );
}

export default App;
