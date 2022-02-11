import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { user_token } = require ('./config.json');

import Discord from 'discord.js-selfbot';

const client = new Discord.Client();
// client.on('ready', () => {
//     console.log('I am ready!');
// });
client.on("message" , message => {
    console.log(message.content);
})
client.login(user_token);