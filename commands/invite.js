import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {invite_link} = require("../config.json");
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get an invite link for the bot'),
    async execute(interaction) {
        await interaction.reply(`Invite link for this bot: ${invite_link}`);
    }
}