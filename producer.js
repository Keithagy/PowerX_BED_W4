const amqplib = require('amqplib');
const ws = require('ws');

const queue = 'tasks';

(async () => {
    const amqpClient = await amqplib.connect('amqp://localhost:5672');
    const channel = await amqpClient.createChannel();
    await channel.assertQueue(queue);

    const wsClient = new ws('ws://localhost:3000/heartbeat');
    wsClient.on('message', function incoming(message) {
        console.log('Producer received: %s', message);
        const messageJSON = { messageData: `${message}` };
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageJSON)), {
            contentType: 'application/json',
        });
    });
})();
