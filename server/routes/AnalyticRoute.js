import bodyParser from "body-parser";
import express from "express";
import {
  addPropertyScore,
  getPropertyScoreById,
} from "../AnalyticController/PropertyScoreController.js";
import {
  addSeoScore,
  getSeoScoreById,
} from "../AnalyticController/SeoScoreController.js";
import {
  createOrUpdateTraffic,
  getTrafficByPropertyId,
} from "../AnalyticController/TrafficController.js";
import { getEnquiryCountByPropertyId } from "../AnalyticController/EnquiryCountController.js";
import { getRankByPropertyId } from "../AnalyticController/RankController.js";

const analyticRouter = express.Router();
analyticRouter.use(bodyParser.json());
analyticRouter.use(bodyParser.urlencoded({ extended: true }));

//? Property Score
analyticRouter.post("/property/score/add", addPropertyScore);
analyticRouter.get("/property/score/:property_id", getPropertyScoreById);

//? SEO Score
analyticRouter.get("/property/seo/score/:property_id", getSeoScoreById);

//?Traffic Score
analyticRouter.post(`/property/traffic`, createOrUpdateTraffic);
analyticRouter.get(`/property/traffic/:property_id`, getTrafficByPropertyId);

//?Enquire Score
analyticRouter.get(
  `/property/enquiry/count/:property_id`,
  getEnquiryCountByPropertyId
);

//? Ranks
analyticRouter.get(`/property/rank/:property_id`, getRankByPropertyId);

export default analyticRouter;
