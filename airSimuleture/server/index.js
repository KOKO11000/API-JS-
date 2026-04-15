// Changes made: Added CORS middleware since cors is in dependencies but was not used. This allows cross-origin requests.
import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

import aircrafts from "./aircrafts/routes.js";
import aircraftTypes from "./aircraftTypes/routes.js";
import flights from "./flights/routes.js";
app.get("/health", (req, res) =>
  res.send("Welcome to the Air Simulateur API!"),
);

app.use("/aircrafts", aircrafts);
app.use("/aircraftTypes", aircraftTypes);
app.use("/flights", flights);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server listening on ${port}`));
