import express from "express";
import cors from "cors";
import health from "./routes/health.ts";
import fileRoutes from "./routes/file.ts";
import mediaJobRoutes from "./routes/media.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", health);
app.use("/file", fileRoutes);
app.use("/media", mediaJobRoutes);

export default app;
