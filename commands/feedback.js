import { SlashCommandBuilder } from "@discordjs/builders";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {feedback_channel_id} = require("../config.json");

export default {
    data: new SlashCommandBuilder()
        .setName("feedback")
        .setDescription("Send feedback to the developers")
        .addStringOption(option => 
            option.setName('input')
                .setDescription('The feedback you want to send')
                .setRequired(true)),
    async execute(interaction) {
        const feedback_text = interaction.options.getString('input');
        const embed = {
            "title": "Feedback",
            "description": feedback_text,
            "color": 16777215,
            "timestamp": new Date(),
        }
        await interaction.client.channels.fetch(feedback_channel_id).then(channel => {
            channel.send({embeds: [embed]});
        });
        interaction.reply("Thank you for your feedback!");
    }
}
