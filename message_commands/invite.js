import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {invite_link} = require("../config.json");

export default {
    name: 'invite',
    description: 'Get an invite link for the bot',
    async execute(message, args) {
        await message.reply(`This command is now deprecated. Use slash command \`/invite\` instead!\nInvite link for this bot: ${invite_link}`);
    }
}