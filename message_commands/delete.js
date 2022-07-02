import { daily_entry as daily_db } from "./../models/utilities.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { token, prefix } = require ('./../config.json');
import confirm_delete_embed from "../utils/confirm_delete_embed.js";
import { s3Delete } from "../utils/aws.js";
import { MessageEmbed } from "discord.js";

export default {
    name: 'delete',
    description: 'Delete an entry',
    async execute(message, args) {
        // send deprecation notice
        const embed = new MessageEmbed()
            .setTitle("Deprecation Notice")
            .setDescription("This command is deprecated, please use the [slash command](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) `addtext` instead");

        message.channel.send({embeds: [embed]});
        return;
        
        const author = message.author.id;
        const entry_id = args[0];

        //if there's no entry id, send a help message
        if (!entry_id){
            message.reply(`\`dl!delete\` is deprecating soon, please use slash command \`/delete\` instead\`\`\`To delete an entry, navigate to that entries using \`${prefix}read\` and react the entry with ❌, then follow the instruction.\`\`\``);
            return;
        }
        message.reply('`dl!delete` is deprecating soon, please use slash command `/delete` instead');
        // check if the entry exists
        let daily_entry = await daily_db.findOne({where: {id: entry_id, author: author}});
        if (!daily_entry){
            message.reply(`Entry with id ${entry_id} not found!`);
            return;
        }

        const confirm = await confirm_delete_embed(daily_entry, message);
        if (!confirm){
            message.reply("Delete cancelled!");
            return;
        }

        // try to delete the s3 object, continue with deleting from the database anyway
        try {
            await s3Delete(daily_entry.url);
        } catch (error) {
            console.log(error);
        }

        // delete the entry
        await daily_db.destroy({where: {id: entry_id, author: author}});
        message.reply(`Entries delete successfully!\nuse \`dl!read\` to view your updated diary.`);
    }
}