const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const settleCtrl = require('../controllers/settlementController');
router.post('/:groupId/settlements', auth, settleCtrl.createSettlementValidation, settleCtrl.createSettlement);
router.get('/:groupId/balances', auth, settleCtrl.getGroupBalances);
router.get('/users/:userId/settlements', auth, settleCtrl.listUserSettlements);
module.exports = router;
