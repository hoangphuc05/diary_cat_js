// Require the necessary discord.js classes
import fs from 'fs';
import { Client, Intents, Collection } from 'discord.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { token, prefix } = require ('./config.json');
import remindLoop from './loop/reminder.js';

// Create a new client instance
const myIntents = new Intents();
myIntents.add([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES]);
const client = new Client({ intents: myIntents });

client.commands = new Collection();
client.messageCommands = new Collection();
//get all files in the commands folder
const messageCommandFiles = fs.readdirSync('./message_commands').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));


for (const file of messageCommandFiles) {
    const command = await import(`./message_commands/${file}`);
    client.messageCommands.set(command.default.name, command.default);
}

for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    // set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.default.data.name, command.default);
}

for (const file of eventFiles) {
	const cimport = await import(`./events/${file}`);
    const command = cimport.default;
	if (command.once) {
		client.once(command.name, (...args) => command.execute(...args));
	} else {
		client.on(command.name, (...args) => command.execute(...args));
	}
}

// handle normal message because Discord is slow af
client.on('messageCreate', async message =>{
    console.log(message.content);
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLocaleLowerCase(); //get the command in the first element and get rid of it from the args array
    if (!client.messageCommands.has(command)) return;

    try {
        await client.messageCommands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})

// responnse to interaction
client.on('interactionCreate', async interaction => {

    //ignore all interactions that is not slash command
	if (!interaction.isCommand()) return;

    // console.log("Command name", interaction);

	const command = client.commands.get(interaction.commandName);

    // return if no command found
    if (!command) return;

    try{
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error trying to execute that command!',
            ephemeral: true
        });
    }
});

client.on("ready", () => {
    // remindLoop(client);

    // setInterval(() => {
    //     remindLoop(client);
    // },60000);
    // setInterval(() => {
    //     client.channels.fetch('827819975167311892').then(channel => {
    //         channel.send(`a`);
    //     }).catch(console.error);
    // }, 5000);
})

// Login to Discord with your client's token
client.login(token);