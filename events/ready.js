// import {client} from './../index.js';
export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log('Ready!');
        client.user.setActivity(`dl!help or /help to get started`);
    }
}