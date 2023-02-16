import { EmbedBuilder } from "discord.js"
import { createRequire } from "module";
import { client } from "./../index.js";
const require = createRequire(import.meta.url);
const {log_channel_id, prefix} = require("../config.json");

export const messageLogger = (command, message, args, error=0) => {
    // build embed message
    const embed = new EmbedBuilder()
        // .setAuthor({name:`${message.author.id}`, iconURL:message.author.avatarURL()})
        .setAuthor({name: `${message.author.id}`, iconURL: message.author.avatarURL()})
        .setTitle(error==1?`Message command Error!`:`Message command`)
        .setFooter({text: new Date().toISOString()})
        .addFields({name: "Command", value: command, inline: true})
        .addFields({name: "Attached length", value: `${message.attachments.size}`, inline: true})

    try{
        // send embed message
        client.channels.fetch(log_channel_id).then(channel => {
            channel.send({embeds: [embed]});
        }).catch(console.error);
    } catch (error) {
        console.log(error);
    }
    
}

export const slashLogger = (interaction, error=0) => {
    const embed = new EmbedBuilder()
        .setAuthor({name:`${interaction.user.id}`, iconURL: interaction.user.avatarURL()})
        .setTitle(error==1?`Slash command Error!`:`Slash command`)
        .setFooter({text: new Date().toISOString()})
        .addFields({name: "Command", value: interaction.commandName, inline: true})

    try{
        // send embed message
        client.channels.fetch(log_channel_id).then(channel => {
            channel.send({embeds: [embed]});
        }).catch(console.error);
    } catch (error) {
        console.log(error);
    }
}

export const generalLogger = (message, error=0) => {
    try{
        client.channels.fetch(log_channel_id).then(channel => {
            channel.send(message);
        }).catch(console.error);
    } catch (error) {
        console.log(error);
    }
}