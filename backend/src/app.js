import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import alertRoutes from "./routes/alertRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js"
import logRoutes from "./routes/logRoutes.js";
import investigationRoutes from "./routes/investigationRoutes.js";
import graphRoutes from "./routes/graphRoutes.js"
import chatRoutes from "./routes/chatRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false  // allows inline scripts and external CDN
}));
app.use(morgan("dev"));
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

app.use("/api/logs", logRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/incidents", incidentRoutes);
app.use( "/api/investigation", investigationRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api/chat",chatRoutes);

export default app;