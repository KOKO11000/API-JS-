import express from 'express';
const app = express();
app.use(express.json());

import aircrafts from './aircrafts/routes.js';
import aircraftTypes from './aircraftTypes/routes.js';
import flights from './flights/routes.js';

app.use('/aircrafts', aircrafts);
app.use('/aircraftTypes', aircraftTypes);
app.use('/flights', flights);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server listening on ${port}`));
