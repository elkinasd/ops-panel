const { Router } = require('express');
const awsController = require('../controllers/aws.controller');

const router = Router();

router.get('/sync', awsController.getSyncLogs);
router.get('/rds', awsController.getRdsStatus);
router.get('/sqs', awsController.getSqsStatus);

module.exports = router;