import { SlashCommandBuilder } from "@discordjs/builders";
import { addEntry } from "../models/utilities.js";

export default {
    data: new SlashCommandBuilder()
        .setName("addtext")
        .setDescription("Add a text entry to your diary")
        .addStringOption(option => 
            option.setName('input')
                .setDescription('The text you want to add to your diary')
                .setRequired(true)),
    async execute(interaction) {
        const entryValue = interaction.options.getString('input');
        const streak_value = await addEntry(interaction.user.id, entryValue, 'None', interaction.user.username, interaction.channelId);

        if (streak_value !== -1){
            await interaction.reply(`Your current streak is ${streak_value} days!`);
        } else {
            await interaction.reply("Something went wrong, please try again");
        }
    }

}