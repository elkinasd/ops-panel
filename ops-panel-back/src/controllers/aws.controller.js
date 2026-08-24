const awsService = require('../services/aws.service');
const { HTTP_STATUS } = require('../constants/api.constants');

const getSqsStatus = async (req, res) => {
  try {
    const data = await awsService.fetchSqsQueues();
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const getSyncLogs = async (req, res) => {
  try {
    const data = await awsService.fetchSyncLogs();
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const getRdsStatus = async (req, res) => {
  try {
    const data = await awsService.fetchRdsStatus();
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSqsStatus,
  getSyncLogs,
  getRdsStatus
};