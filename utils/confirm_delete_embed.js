import {DateTime} from 'luxon';
import deleteEmbed from "./build_delete_embed.js";


export default async (entry_model, userMessage) => {
    const diary_embed = await deleteEmbed(entry_model);
    diary_embed.setFooter({text:`React ✅ to delete, ❌ to keep.`});

    let confirmMessage = await userMessage.channel.send({embeds: [diary_embed]});
    // add reactions
    await confirmMessage.react('✅');
    await confirmMessage.react('❌');

    // add event listener
    const filter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === userMessage.author.id;
    }
    const collector = confirmMessage.createReactionCollector( {filter,idle: 60000});

    return await new Promise (resolve => {
        collector.on('collect', async (reaction, user) => {
            // read the reaction and increase or decrease the index, if it is out of bound, wrap around
            if (reaction.emoji.name === '✅'){
                try {
                    await confirmMessage.delete();
                } catch (error) {
                    // do nothing
                }
                resolve(true);
            } else if (reaction.emoji.name === '❌'){
                try {
                    await confirmMessage.delete();
                } catch (error) {
                    // do nothing
                }
                resolve(false);
            }
        });
        
        // if the user does not react within 1 minute, delete the message and return false
        collector.on('end',  async () => {
            try {
                await confirmMessage.delete();
            } catch (error) {
                // do nothing
            }
            resolve(false);
        })
    })
}