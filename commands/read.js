import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton } from 'discord.js';
import {daily_entry as daily_db} from './../models/utilities.js';
import build_embed from '../utils/build_read_embed.js';


export default {
    data: new SlashCommandBuilder()
        .setName('read')
        .setDescription('Reads all of your diary entries'),
    async execute(interaction) {

        // build 2 interactive buttons
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setEmoji('⬅')
                    .setLabel('Previous')
                    .setStyle('PRIMARY')
            ).addComponents(
                new MessageButton()
                    .setCustomId('next')
                    .setEmoji('➡')
                    .setLabel('Next')
                    .setStyle('PRIMARY')
            );

        // find all entries from that user
        // console.log(interaction.user);
        let daily_entries = await daily_db.findAll({where: {author: interaction.user.id}});
        if (daily_entries.length === 0){
            await interaction.reply('You have no entries yet! Use `/add` to write your first entry.');
            return;
        }

        let current_daily_index = daily_entries.length - 1;
        let embed = await build_embed(daily_entries[current_daily_index]);
        
        await interaction.reply({embeds: [embed], components: [row]})
        let bot_message = await interaction.fetchReply();
        // console.log("Bot message: ", bot_message);
       

        // wait for button interaction
        const filter = i => {
            // i.deferUpdate();
            return i.user.id === interaction.user.id;
            // return true;
        }

        const emojiFilter = (reaction, user) => {
            return ['❌'].includes(reaction.emoji.name) && user.id === interaction.user.id;
        }


        // if no message is sent, return
        if (!bot_message){
            return;
        }

        const collector = bot_message.createMessageComponentCollector({filter, componentType: 'BUTTON', idle: 300000});

        collector.on('collect', async (i) => {
            if (i.customId === "previous"){
                current_daily_index = current_daily_index - 1;
                if (current_daily_index < 0){
                    current_daily_index = daily_entries.length - 1;
                }
            } else if (i.customId === "next"){
                current_daily_index = current_daily_index + 1;
                if (current_daily_index >= daily_entries.length){
                    current_daily_index = 0;
                }
            }
            embed = await build_embed(daily_entries[current_daily_index]);
            bot_message.edit({embeds: [embed]});
            i.deferUpdate();
        });
        
        const emojiCollector = bot_message.createReactionCollector({emojiFilter, idle: 300000});

        emojiCollector.on("collect", async (reaction, user) => {
            if (reaction.emoji.name === '❌'){
                interaction.followUp(`To delete this entry, use command:\n \`\`\`cpp\n\\delete ${daily_entries[current_daily_index].id}\`\`\`\nIf you don't want to delete this entry, just ignore this message!\n**Warning: This action is irreversible**`)
            }
        })
    }
}