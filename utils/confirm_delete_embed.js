import { MessageEmbed } from "discord.js"

export default async (entry_model, userMessage) => {
    const diary_embed = new MessageEmbed()
        .setTitle("Entry delete confirm")
        .setDescription(`Please confirm you want to delete this entries`)
        // .setURL(entry_model.url)
        .setFooter(`React ✅ to delete, ❌ to keep.`)
        
    // set the time
    if (!entry_model.date.toString().includes('-')){
        diary_embed.addField(`Date added`,`<t:${Math.floor(parseInt(entry_model.date)/1000)}:D>`)
    } else {
        diary_embed.addField(`Date added`,`<t:${Math.floor(DateTime.fromFormat(entry_model.date, "dd-MM-yyyy").toMillis()/1000)}:D>`)
    }

    // get the first 1020 characters of the message
    const previewMessage = entry_model.message==""? "":entry_model.message.substring(0,1015); // if there's no message, then return empty array
    if (previewMessage.length > 0){
        diary_embed.addField(`Note`, `${previewMessage}`);
    }

    // get the url of the picture
    if (entry_model.url !== 'None' && entry_model.url !== null){
        const presignedImageUrl = await presignUrl(entry_model.url);
        if (presignedImageUrl){
            diary_embed.setImage(presignedImageUrl);
        }
    }

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
            console.log("end called");
            try {
                await confirmMessage.delete();
            } catch (error) {
                // do nothing
            }
            resolve(false);
        })
    })
}