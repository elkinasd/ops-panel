const { SQSClient, ListQueuesCommand } = require('@aws-sdk/client-sqs');
const { CloudWatchLogsClient, GetLogEventsCommand } = require('@aws-sdk/client-cloudwatch-logs');
const { RDSClient, DescribeDBInstancesCommand } = require('@aws-sdk/client-rds');

const awsRegion = process.env.AWS_REGION;
const awsEndpoint = process.env.AWS_ENDPOINT;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!awsRegion) {
  throw new Error('AWS_REGION is not defined. Add it to the backend .env file.');
}

if (!awsAccessKeyId || !awsSecretAccessKey) {
  throw new Error('AWS credentials are not defined. Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to the backend .env file.');
}

const awsConfig = {
  region: awsRegion,
  endpoint: awsEndpoint,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
};

const sqsClient = new SQSClient(awsConfig);
const cloudWatchLogsClient = new CloudWatchLogsClient(awsConfig);
const rdsClient = new RDSClient(awsConfig);

const fetchSqsQueues = async () => {
  try {
    const data = await sqsClient.send(new ListQueuesCommand({}));
    return {
      status: 'success',
      source: 'SQS',
      data: data.QueueUrls || [],
    };
  } catch (error) {
    return {
      status: 'error',
      source: 'SQS',
      message: error.message,
    };
  }
};

const fetchSyncLogs = async () => {
  try {
    const data = await cloudWatchLogsClient.send(new GetLogEventsCommand({
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP || '/aws/vendedlogs/states/SyncStateMachine',
      logStreamName: process.env.CLOUDWATCH_LOG_STREAM || 'execution-errors',
      limit: 10,
    }));
    return {
      source: 'CloudWatch Logs',
      data: data.events || [],
    };
  } catch (error) {
    return {
      status: 'error',
      source: 'CloudWatch Logs',
      message: error.message,
    };
  }
};

const fetchRdsStatus = async () => {
  try {
    const data = await rdsClient.send(new DescribeDBInstancesCommand({
      DBInstanceIdentifier: process.env.RDS_INSTANCE_IDENTIFIER || 'portal-db-local',
    }));
    const db = data.DBInstances[0];
    return {
      source: 'RDS',
      id: db.DBInstanceIdentifier,
      status: db.DBInstanceStatus,
      engine: db.Engine,
      endpoint: db.Endpoint ? db.Endpoint.Address : null,
    };

  } catch (error) {
    return {
      status: 'error',
      source: 'RDS',
      message: error.message,
    };
  }
};

module.exports = {
  fetchSqsQueues,
  fetchSyncLogs,
  fetchRdsStatus,
};