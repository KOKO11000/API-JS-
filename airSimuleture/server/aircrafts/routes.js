import express from 'express';
const router = express.Router();
import * as controller from './controller.js';

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.deleteById);


export default router;
