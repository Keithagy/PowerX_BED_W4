/**
 * Create an Express.js server application that publishes its heartbeat:
 *  A WebSocket endpoint /heartbeat that sends heartbeat messages to clients
 *  A producer that publishes heartbeat messages to the heartbeat queue
 *  A consumer that subscribes to the heartbeat queue and writes the messages to a file log.txt (append-mode)
 *
 * Heartbeat messages to send/publish:
 *  Every minute: “I’m alive at ${datetime}!”
 *  Every 42nd minute of the hour: “42 is the meaning to life!”
 */

const express = require('express');
const enableWs = require('express-ws');
const cron = require('node-cron');

const app = express();
enableWs(app);
app.ws('/heartbeat', (ws, req) => {
    console.log('New subscriber at /heartbeat');
    ws.send('Hello, I am a heartbeat and you are a new subscriber');

    const taskMinute = cron.schedule('* * * * *', () => {
        let current = new Date();
        let cDate =
            current.getFullYear() +
            '-' +
            (current.getMonth() + 1) +
            '-' +
            current.getDate();
        let cTime =
            current.getHours() +
            ':' +
            current.getMinutes() +
            ':' +
            current.getSeconds();
        let dateTime = cDate + ' ' + cTime;

        // Do some task
        console.log(`1 minute! I'm alive at ${dateTime}!`);
        ws.send(`I'm alive at ${dateTime}!`);
    });

    const task42 = cron.schedule('42 * * * *', () => {
        // Do some task
        console.log(`42 minutes! 42 is the meaning to life!`);
        ws.send(`42 is the meaning to life!`);
    });



    // ws.on('message', (msg) => {
    //     console.log(msg);
    //     ws.send(`hello ${msg}`);
    // });

    ws.on('close', () => {
        console.log('Goodbye subscriber');
        taskMinute.stop();
        task42.stop()
    });
});
app.listen(3000);
