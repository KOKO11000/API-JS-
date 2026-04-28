import cors from "cors";
import express from "express";

import aircraftRoutes from "./aircrafts/routes.js";
import aircraftTypeRoutes from "./aircraftTypes/routes.js";
import flightRoutes from "./flights/routes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.send("🚀 Air Simulator API is ready.");
});

app.use("/aircrafts", aircraftRoutes);
app.use("/aircraftTypes", aircraftTypeRoutes);
app.use("/flights", flightRoutes);

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
