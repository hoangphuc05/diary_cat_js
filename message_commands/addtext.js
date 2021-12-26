import {last_time as last_time_db, addEntry} from './../models/utilities.js';
import { uploadFile } from './../utils/fileUploader.js';
import confirm_embed from '../utils/confirm_embed.js';


export default {
    name: 'addtext',
    description: 'Add a new entries',
    aliases: ['addtextanyway'],
    async execute(message, args) {
        
        //send typing indicator
        message.channel.sendTyping();

        const author = message.author.id;
        const channel = message.channelId;
        const message_content = message.content.indexOf(' ')===-1?"":message.content.substr(message.content.indexOf(' ') + 1);
        const current_time = new Date().getTime();

        // find the last time the user posted
        let last_time = await last_time_db.findOne({where: {id: author}});
        last_time = last_time.time;
        console.log("last time is:" , last_time);

        // if last time is too recent, ask for confirmation
        // if (last_time){
        // if confirm is yes, or if last time is normal, continue

        //check if there's any content in the message
        if (message_content === "" && message.attachments.size === 0){
            message.channel.send("You need to enter some content or attach a file to post");
            return;
        }
        // console.log(message.attachments);
        let streak_value;

        // upload the picture to AWS and get the link to it
        if (message.attachments.size > 0){
            // confirm with the user that they want to add entry with no picture
            const confirm = await confirm_embed("Picure included", "Are you sure you want to add this entry WITH a picture?", "use `dl!add` to skip this", message);
            if (!confirm){
                message.reply("No entry is added");
                return;
            }
            // loop through the attachments
            for (const [id, attachment] of message.attachments){
                console.log(attachment);
                const url = await uploadFile(attachment.url);
                // create the entry
                // console.log("url is", url);
                streak_value = await addEntry(author, message_content, url, message.author.username, message.channelId);
                if (streak_value === -1){
                    message.channel.send("One of your picture was not added, please try again or change to another picture.")
                }
            }
        } else {
            
            streak_value = await addEntry(author, message_content, 'None', message.author.username, message.channelId);
        }
        // console.log(message.attachments.size);
        // reply with the streak
        if (streak_value !== -1){
            message.reply(`Your current streak is ${streak_value} days!`);
        }
    }
}