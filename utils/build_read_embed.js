import { MessageEmbed } from "discord.js"
import {DateTime} from 'luxon';
import { presignUrl } from "./presignUrl.js";

export default async (entry_model) => {
    const diary_embed = new MessageEmbed()
        // .setTitle(`<t:${Math.floor(parseInt(entry_model.date)/1000)}:D>`)
        // .setURL(entry_model.url)
        .setFooter({text:`${entry_model.name}`})
    
    // check if string is unix timestamp
    if (!entry_model.date.toString().includes('-')){
        diary_embed.setTitle(`<t:${Math.floor(parseInt(entry_model.date)/1000)}:D>`)

    } else {
        diary_embed.setTitle(`<t:${Math.floor(DateTime.fromFormat(entry_model.date, "dd-MM-yyyy").toMillis()/1000)}:D>`)
    }

    // get presign url and set it as url
    if (entry_model.url !== 'none' && entry_model.url !== null){
        const presignedImageUrl = await presignUrl(entry_model.url);
        if (presignedImageUrl){
            diary_embed.setImage(presignedImageUrl);
        }
    }

    // divide the message into chunks of 1023 characters
    const message_chunks = entry_model.message==""? []:entry_model.message.match(/.{1,1023}/g); // if there's no message, then return empty array
    for (let i = 0; i < message_chunks.length; i++){
        diary_embed.addField(`Note ${i+1}`, `${message_chunks[i]}`);
    }

    return diary_embed;
}