import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import {daily_entry as daily_db, daily_entry} from './../models/utilities.js';
import deleteEmbed from './../utils/build_delete_embed.js'
import build_embed from '../utils/build_read_embed.js';


export default {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Deletes a diary entry")
        .addIntegerOption(option =>
            option.setName("index")
                .setDescription("The index of the entry you want to delete")
                .setRequired(false)),
    async execute(interaction) {

        // build 2 interactive buttons
        const deleteRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("delete")
                    .setEmoji("🗑️")
                    .setLabel("Delete")
                    .setStyle(ButtonStyle.Danger)
            ).addComponents(
                new ButtonBuilder()
                    .setCustomId("cancel")
                    .setEmoji("❌")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Primary)
            );
        
        const readRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setEmoji('⬅')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
        ).addComponents(
            new ButtonBuilder()
                .setCustomId('next')
                .setEmoji('➡')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
        ).addComponents(
            new ButtonBuilder()
                .setCustomId("delete")
                .setEmoji("🗑️")
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
        );


        // get the index of the entry
        let index = interaction.options.getInteger("index");
        let bot_message;
        const filter = i => {
            // i.deferUpdate();
            return i.user.id === interaction.user.id;
            // return true;
        }

        // if there's no index, send help message
        if (!index) {
            // find all entries from that user
            // console.log(interaction.user);
            let daily_entries = await daily_db.findAll({where: {author: interaction.user.id}});
            if (daily_entries.length === 0){
                await interaction.reply('You have no entries yet! Use `/add` to write your first entry.');
                return;
            }

            let current_daily_index = daily_entries.length - 1;
            let embed = await build_embed(daily_entries[current_daily_index]);
            
            await interaction.reply({embeds: [embed], components: [readRow], ephemeral:true});
            bot_message = await interaction.fetchReply();
            // console.log("Bot message: ", bot_message);
            // interaction.followUp("hi");

            // wait for button interaction
            

            // if no message is sent, return
            if (!bot_message){
                return;
            }

            const collector = bot_message.createMessageComponentCollector({filter, idle: 60000});

            collector.on('collect', async (i) => {
                if (i.customId === "previous"){
                    current_daily_index = current_daily_index - 1;
                    if (current_daily_index < 0){
                        current_daily_index = daily_entries.length - 1;
                    }

                    embed = await build_embed(daily_entries[current_daily_index]);
                    await interaction.editReply({embeds: [embed]});
                    i.deferUpdate();
                    
                } else if (i.customId === "next"){
                    current_daily_index = current_daily_index + 1;
                    if (current_daily_index >= daily_entries.length){
                        current_daily_index = 0;
                    }
                
                    embed = await build_embed(daily_entries[current_daily_index]);
                    await interaction.editReply({embeds: [embed]});
                    i.deferUpdate();

                } else if (i.customId === "delete"){

                    let dailyEntry = await daily_db.findOne({where: {id: daily_entries[current_daily_index].id, author: interaction.user.id}});
                    if (!dailyEntry){
                        interaction.followUp(`Entry with id ${daily_entries[current_daily_index].id} not found!`);
                        i.deferUpdate();
                        return;
                    }

                    // send confirmation message
                    const deleteConfirmEmbed = await deleteEmbed(dailyEntry);
                    await i.reply({embeds: [deleteConfirmEmbed], components: [deleteRow], ephemeral: true});
                    let deleteMessage = await i.fetchReply();
                    // i.deferUpdate();
                    
                    const deleteCollector = deleteMessage.createMessageComponentCollector({filter, idle: 60000});
                    deleteCollector.on('collect', async (di) => {
                        if (di.customId === "delete"){
                            await dailyEntry.destroy();
                            await di.reply({content:`Entries delete successfully! use /read to view your updated entries.`, ephemeral:true} );
                            deleteCollector.stop();
                            return;
                        } else {
                            await di.reply({content:`Delete cancelled!`, ephemeral:true} );
                            deleteCollector.stop();
                            return;
                        }
                    });
                }
                
            });
        } else {

            // get the entry from the index
            let dailyEntry = await daily_db.findOne({where: {id: index, author: interaction.user.id}});
            if (!dailyEntry){
                interaction.followUp(`Entry with id ${index} not found!`);
                return;
            }

            // send confirmation message
            const deleteConfirmEmbed = await deleteEmbed(dailyEntry);
            await interaction.reply({embeds: [deleteConfirmEmbed], components: [deleteRow], ephemeral: true});
            let deleteMessage = await interaction.fetchReply();
            // i.deferUpdate();
            
            const deleteCollector = deleteMessage.createMessageComponentCollector({filter, idle: 60000});
            deleteCollector.on('collect', async (di) => {
                if (di.customId === "delete"){
                    await dailyEntry.destroy();
                    await di.reply({content:`Entries delete successfully! use /read to view your updated entries.`, ephemeral:true} );
                    deleteCollector.stop();
                    return;
                } else {
                    await di.reply({content:`Delete cancelled!`, ephemeral:true} );
                    deleteCollector.stop();
                    return;
                }
            });
        }

        

    }
}