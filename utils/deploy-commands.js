import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from'discord-api-types/v9';
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { clientId, guildId, token } = require ('../config.json');


const commands = [];
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`../commands/${file}`);
	commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

// rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
// 	.then(() => console.log('Successfully registered application commands.'))
// 	.catch(console.error);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);