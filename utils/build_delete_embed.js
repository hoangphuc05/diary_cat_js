import { MessageEmbed } from "discord.js"
import { presignUrl } from "./presignUrl.js";
import {DateTime} from 'luxon';

export default async (entryModel) => {
    const diaryEmbed = new MessageEmbed()
        .setTitle("Entry delete confirm")
        .setDescription(`Please confirm you want to delete this entries`);
    
    // set the time
    if (!entryModel.date.toString().includes('-')){
        diaryEmbed.addField(`Date added`,`<t:${Math.floor(parseInt(entryModel.date)/1000)}:D>`)
    } else {
        diaryEmbed.addField(`Date added`,`<t:${Math.floor(DateTime.fromFormat(entryModel.date, "dd-MM-yyyy").toMillis()/1000)}:D>`)
    }

    // get the first 1020 characters of the message
    const previewMessage = entryModel.message==""? "":entryModel.message.substring(0,1015); // if there's no message, then return empty array
    if (previewMessage.length > 0){
        diaryEmbed.addField(`Note`, `${previewMessage}[...]`);
    }

    // get the url of the picture
    if (entryModel.url !== 'none' && entryModel.url !== null){
        const presignedImageUrl = await presignUrl(entryModel.url);
        if (presignedImageUrl){
            diaryEmbed.setImage(presignedImageUrl);
        }
    }

    return diaryEmbed;
}