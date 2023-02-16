import { createRequire } from "module";
const require = createRequire(import.meta.url);
const helpMessage = require("../help.json");
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show list of available commands'),
    async execute(interaction) {
        await interaction.reply({embeds: [helpMessage]});
    }
}