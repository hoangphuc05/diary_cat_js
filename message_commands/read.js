import {daily_entry as daily_db} from './../models/utilities.js';

import build_embed from '../utils/build_read_embed.js';

export default {
    name: 'read',
    description: 'Read diary entries',
    async execute(message, args) {
        const author = message.author.id;
        
        let daily_entries = await daily_db.findAll({where: {author: author}});
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
                botMessage.reply(`To delete this message, use command \`dl!delete ${daily_entries[current_daily_index].id}\``);
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