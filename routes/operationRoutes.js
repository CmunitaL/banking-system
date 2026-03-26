const express = require('express');
const router = express.Router();

const operationController = require('../controllers/operationController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.post('/transfer', isAuthenticated, operationController.transfer);
router.get('/my-accounts', isAuthenticated, operationController.getMyAccounts);
router.post('loan', isAuthenticated, operationController.requestLoan);
router.post('/schedule-transfer', isAuthenticated, operationController.scheduleTransfer);

module.exports = router;