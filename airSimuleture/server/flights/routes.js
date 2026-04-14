import express from 'express';
const router = express.Router();
import * as controller from './controller.js';

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);

export default router;
