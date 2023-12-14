const sqsInfra = require('./infra/sqs.infra');
const sqsService = require('./services/sqs.service');

const snsInfra = require('./infra/sns.infra');
const snsService = require('./services/sns.service');

const warehouseDelayedQueueName = 'warehouse-delayed-queue';
const increaseInventoryQueueName = 'increase-inventory-queue';
const updateInventoryStatusQueueName = 'update-inventory-status-queue';

const increaseInventoryTopicName = 'increase-inventory-topic';

execute();

async function execute() {
    await createQueuesAndTopics();
    // await subscribeTopicsInQueues();
    await throwMessages();
    consumeMessages();
}

async function createQueuesAndTopics() {
    sqsInfra.createQueue(warehouseDelayedQueueName);
    // sqsInfra.createQueue(increaseInventoryQueueName);
    // sqsInfra.createQueue(updateInventoryStatusQueueName);

    // snsInfra.createSnsTopic(increaseInventoryTopicName);

    await sleep(500);
}

async function subscribeTopicsInQueues() {
    snsInfra.subscribeSnsTopicInQueue(increaseInventoryTopicName, increaseInventoryQueueName);
    snsInfra.subscribeSnsTopicInQueue(increaseInventoryTopicName, updateInventoryStatusQueueName);

    await sleep(500);
}

async function throwMessages() {
    // Send directly message to a queue
    sqsService.sendMessageQueue(warehouseDelayedQueueName, 'SQS DIRECT MESSAGE!', {});

    // Just one publishing to broadcast the message to all consumers
    // snsService.publishMessage(increaseInventoryTopicName, 'SNS BROADCAST MESSAGE!');

    await sleep(500);
}

function consumeMessages() {
    // Each service can consume specific queues
    sqsService.consumeMessages(warehouseDelayedQueueName);

    // sqsService.consumeMessages(increaseInventoryQueueName);
    // sqsService.consumeMessages(updateInventoryStatusQueueName);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}