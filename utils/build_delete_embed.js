import { EmbedBuilder } from "discord.js"
import { presignUrl } from "./presignUrl.js";
import {DateTime} from 'luxon';

export default async (entryModel) => {
    const diaryEmbed = new EmbedBuilder()
        .setTitle("Entry delete confirm")
        .setDescription(`Please confirm you want to delete this entries`);
    
    // set the time
    if (!entryModel.date.toString().includes('-')){
        diaryEmbed.addFields({name: `Date added`,value:`<t:${Math.floor(parseInt(entryModel.date)/1000)}:D>`})
    } else {
        diaryEmbed.addFields({name: `Date added`,value: `<t:${Math.floor(DateTime.fromFormat(entryModel.date, "dd-MM-yyyy").toMillis()/1000)}:D>`})
    }

    // get the first 1020 characters of the message
    const previewMessage = entryModel.message==""? "":entryModel.message.substring(0,1015); // if there's no message, then return empty array
    if (previewMessage.length > 0){
        diaryEmbed.addFields({name: `Note`, value:`${previewMessage}[...]`});
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