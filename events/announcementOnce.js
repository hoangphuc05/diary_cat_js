import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { token, prefix } = require ('../config.json');

export default {
    name: 'messageCreate',
    once: false,
    execute(message) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        
    }
}