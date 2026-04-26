import express from 'express';
const router = express.Router();
import * as controller from './controller.js';

router.get('/', controller.list);
router.get('/within-radius', controller.withinRadius);
router.post('/within-polygon', controller.withinPolygon);
router.get('/:id/distance', controller.getDistanceForFlight);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.deleteById);

export default router;
