import app from "./app";
import { startMediaJobWorker } from "./workers/media-job-worker";

startMediaJobWorker(); // Kicks off background processing

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
