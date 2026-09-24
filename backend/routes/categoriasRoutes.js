const router = require('express').Router();
const controller = require('../controllers/categoriasController');
const { authenticate, requireAdmin } = require('../middleware/auth');
router.get('/', authenticate, controller.index);
router.post('/', authenticate, requireAdmin, controller.create);
router.put('/:id', authenticate, requireAdmin, controller.update);
router.delete('/:id', authenticate, requireAdmin, controller.remove);
module.exports = router;
