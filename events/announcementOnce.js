import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { token, prefix } = require ('../config.json');

import { getUnreadAnnouncement, announcement_read } from "../models/utilities.js";

export default {
    name: 'messageCreate',
    once: false,
    execute(message) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        getUnreadAnnouncement(message.author.id).then(announcement => {
            if (announcement.length < 1) {
                return;
            }

            message.channel.send(`${announcement[0].dataValues.content}`);
            
            // Add read receipt
            announcement_read.create({
                user_id: message.author.id,
                announcement_id: announcement[0].dataValues.id
            });
        });
    }
}