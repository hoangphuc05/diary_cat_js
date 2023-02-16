import { SlashCommandBuilder } from "discord.js";
import { addEntry } from "../models/utilities.js";
import { uploadFile } from './../utils/fileUploader.js';


export default {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add a picture entry to your diary")
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text entry you want to add to your diary')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Image you want to add to your diary')
                .setRequired(true)),
    async execute(interaction) {
        
        const entryValue = interaction.options.getString('text');
        const image = interaction.options.getAttachment('image');
        if (image == null || entryValue == null) {
            await interaction.reply("Something went wrong, please try again or report the error");
            return;
        }

        const url = await uploadFile(image.url);
        const streak_value = await addEntry(interaction.user.id, entryValue, url, interaction.user.username, interaction.channelId);

        if (streak_value !== -1){
            await interaction.reply(`Your current streak is ${streak_value} days!`);
        } else {
            await interaction.reply("Something went wrong, please try again");
        }
    }
}