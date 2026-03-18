import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { guilds } from '../enums';
import path from 'node:path';
import fs from 'node:fs';
import { Command } from './types/command';

const clientId = process.env.CLIENT_ID as string;
const guildId = guilds.senkiTranslationServer.id as string;
const token = process.env.DISCORD_TOKEN as string;

const globalCommands = [];
const guildCommands = [];

// Grab all the command folders from the commands directory
const foldersPath = path.join(__dirname, 'commands');
console.log("Folders path: ", foldersPath);
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
	console.log("Checking folder", folder);
	// Grab all the command files from the commands directory
	const commandsPath = join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = join(commandsPath, file);
		const command = require(filePath).default as Command;
		if (command.data) {
			const commandJson = command.data.toJSON();
			// Check if command should be deployed globally
			if (command.global === true) {
				globalCommands.push(commandJson);
				console.log(`  - ${command.data.name} (global)`);
			} else {
				guildCommands.push(commandJson);
				console.log(`  - ${command.data.name} (guild)`);
			}
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// Deploy commands!
(async () => {
	try {
		// Deploy global commands
		if (globalCommands.length > 0) {
			console.log(`\nStarted refreshing ${globalCommands.length} global application (/) commands.`);
			const globalData = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: globalCommands },
			) as any[];
			console.log(`Successfully reloaded ${globalData.length} global application (/) commands.`);
		} else {
			console.log('\nNo global commands to deploy.');
		}

		// Deploy guild-specific commands
		if (guildCommands.length > 0) {
			console.log(`\nStarted refreshing ${guildCommands.length} guild-specific application (/) commands.`);
			const guildData = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: guildCommands },
			) as any[];
			console.log(`Successfully reloaded ${guildData.length} guild-specific application (/) commands.`);
		} else {
			console.log('\nNo guild-specific commands to deploy.');
		}

		console.log('\n✓ Command deployment complete!');
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
