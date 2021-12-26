import { createRequire } from "module";
const require = createRequire(import.meta.url);
const helpMessage = require("../help.json");
import fs from 'fs';

export default {
    name: "help",
    description: "Get help on commands",
    async execute(message, args) {
        const helpArgs = args[0];

        if (!helpArgs) {
            // send genetic help message
            message.reply({embeds: [helpMessage]});
            return;
        }

        // send help message for specific command

        // import all commands in this folder
        const messageCommandFiles = fs.readdirSync('./message_commands').filter(file => file.endsWith('.js'));
        for (const file of messageCommandFiles) {
            const command = await import(`./${file}`);
            console.log(command.default.name);
            if (command.default.name === helpArgs) {
                message.reply({embeds: [{
                    title: `Command: ${command.default.name}`,
                    description: `Description: ${command.default.description}`,
                }]});
                return;
            }
        }
        message.reply(`Command ${helpArgs} not found.`);
        return;
    }
};