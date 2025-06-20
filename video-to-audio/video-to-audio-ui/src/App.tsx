import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ProgressButton } from "./components/ProgressButton";
import { useAudioJob } from "./hooks/useAudioJob";
import { useSmoothProgress } from "./hooks/useSmoothProgress";

function App() {
  const [url, setUrl] = useState("");
  const { job, loading, audioFile, error, startAudioJob } = useAudioJob();
  const realProgress = job?.progress ?? 0;
  const animatedProgress = useSmoothProgress(realProgress, 1); // 1% per frame

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
      <input
        type="text"
        value={url}
        placeholder="Paste URL here"
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "80%", padding: "0.5rem" }}
      />
      <br />
      <br />
      <ProgressButton
        loading={loading}
        progress={animatedProgress}
        disabled={!url || loading}
        onClick={() => startAudioJob(url)}
      />

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
