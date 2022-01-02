import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('servercount')
        .setDescription('Get the server count of the bot'),
    async execute(interaction) {
        await interaction.reply(`Server count: ${interaction.client.guilds.cache.size}`);
    }
}

