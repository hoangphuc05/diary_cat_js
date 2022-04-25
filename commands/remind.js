import { reminder } from "../models/utilities.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("remind")
        .setDescription("Toggle reminder on/off")
        .addIntegerOption(option =>
            option.setName("state")
                .setDescription("Toggle reminder")
                .setRequired(true)
                .addChoices({name:"on", value:1})
                .addChoices({name:"off", value:0}),    
        ),
    async execute(interaction) {
        // find the reminder of the user
        const userReminder = await reminder.findOne({where: {id: interaction.user.id}});
        // get the choice from the user
        const state = interaction.options.getInteger("state");
        if (userReminder){
            // if the user has a reminder, update the state
            userReminder.remind_switch = state;
            await userReminder.save();
        } else {
            // if the user doesn't have a reminder, create one
            await reminder.create({
                id: interaction.user.id,
                remind_switch: state,
                reminded: 0
            });
        }

        // reply with the new state
        await interaction.reply(`Reminder is now ${state == 0? "off" : "on"}`);
    }
}