// import {client} from './../index.js';
export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log('Ready!');
        client.user.setActivity(`/help or mention the bot with help command to get started`);
    }
}