const router = require('express').Router();
const controller = require('../controllers/dashboardController');
const { authenticate, requireAdmin } = require('../middleware/auth');
router.get('/', authenticate, controller.index);
router.get('/auditoria', authenticate, requireAdmin, controller.audit);
module.exports = router;