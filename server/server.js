import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import router from "./routes/index.js";
import ExpireVerification from "./helper/ExpireVerification/ExpireVerification.js";
import cookieParser from "cookie-parser";
import analyticRouter from "./routes/AnalyticRoute.js";
import { AssignRankToAllProperties } from "./AnalyticController/RankController.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_DASHBOARD_URL],
    credentials: true,
  })
);
app.use("/api/", router);
app.use("/api/", analyticRouter);
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use("/media", express.static("media"));

setInterval(() => {
  ExpireVerification();
}, 1);

setInterval(() => {
  AssignRankToAllProperties();
}, 10000);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
