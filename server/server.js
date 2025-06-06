import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import analyticRouter from "./routes/AnalyticRoute.js";
import profileRoutes from "./routes/ProfileRoute.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_DASHBOARD_URL,
      process.env.FRONTEND_CAREER_URL,
    ],
    credentials: true,
  })
);
app.use("/api/", router);
app.use("/api/", analyticRouter);
app.use("/api/", profileRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
