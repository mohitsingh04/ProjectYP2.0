import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import analyticRouter from "./routes/AnalyticRoute.js";
import profileRoutes from "./routes/ProfileRoute.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DASHBOARD_URL,
  process.env.FRONTEND_CAREER_URL,
];

app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

export function originGuard(req, res, next) {
  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
}

app.use("/api/", originGuard, router);
app.use("/api/", originGuard, analyticRouter);
app.use("/api/", originGuard, profileRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
