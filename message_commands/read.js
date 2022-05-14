import {daily_entry as daily_db, daily_entry} from './../models/utilities.js';
import build_embed from '../utils/build_read_embed.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { token, prefix } = require ('./../config.json');

export default {
    name: 'read',
    description: 'Read diary entries',
    async execute(message, args) {

        // send deprecation notice
        const deprecated_embed = new MessageEmbed()
            .setTitle("Deprecation Notice")
            .setDescription("This command is going to be deprecated, please use the [slash command](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) `read` instead");

        message.channel.send({embeds: [deprecated_embed]});

        const author = message.author.id;
        
        let daily_entries = await daily_db.findAll({where: {author: author}});
        if (daily_entries.length === 0){
            message.reply(`You don't have any entries yet! Use \`${prefix}add\` to write your first entry.`);
            return;
        }
        let current_daily_index = daily_entries.length - 1;
        let embed = await build_embed(daily_entries[current_daily_index]);
        let botMessage = await message.channel.send({embeds: [embed]});

        // add reactions
        botMessage.react('⬅️');
        botMessage.react('➡️');

        // add event listener
        const filter = (reaction, user) => {

            return ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
            // return ['⬅️', '➡️'].includes(reaction.emoji.name);

        }
        const collector = botMessage.createReactionCollector( {filter,idle: 300000});

        collector.on('collect', async (reaction, user) => {
            // read the reaction and increase or decrease the index, if it is out of bound, wrap around
            if (reaction.emoji.name === '⬅️'){
                current_daily_index = current_daily_index - 1;
                if (current_daily_index < 0){
                    current_daily_index = daily_entries.length - 1;
                }
            } else if (reaction.emoji.name === '➡️'){
                current_daily_index = current_daily_index + 1;
                if (current_daily_index >= daily_entries.length){
                    current_daily_index = 0;
                }
            } else if (reaction.emoji.name === '❌'){
                botMessage.reply(`To delete this entry, use command:\n \`\`\`cpp\n${prefix}delete ${daily_entries[current_daily_index].id}\`\`\`\nIf you don't want to delete this entry, just ignore this message!\n**Warning: This action is irreversible**`);
            }

            // try to remove the reaction
            try {
                reaction.users.remove(user);
            } catch (error) {
                console.log(error);
            }

            // update the embed
            embed = await build_embed(daily_entries[current_daily_index]);
            botMessage.edit({embeds: [embed]});
            
        });
    }
}