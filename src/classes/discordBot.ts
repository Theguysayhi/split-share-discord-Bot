import {
  Client,
  type ClientOptions,
  Collection,
  GatewayIntentBits,
  Message,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import type { Command } from "../types/command";

export type EventTrigger = {
  trigger: RegExp;
  allowedRoles?: string[]; // Roles allowed to use the trigger
  callback: (context: DiscordBot, message: Message<boolean>) => void;
};

interface DiscordBotOptions {
  botToken: string | undefined;
  eventTriggers?: EventTrigger[];
  channelIds?: string[]; // Deprecated
  clientOptions?: ClientOptions;
  commandsDirectory?: string;
  eventsDirectory?: string;
}

export class DiscordBot extends Client {
  public botToken?: string;
  public triggers?: EventTrigger[];
  public eventsDirectory?: string;
  public commands: Collection<any, any>;

  /**
   * Initializes a new instance of the DiscordBot class.
   *
   * @param options The options object containing all required parameters:
   *   - {string} options.botToken The token of the Bot.
   *   - {EventTrigger[]} [options.eventTriggers] The list of triggers that the bot should listen for.
   *   - {string[]} [options.channelIds] (Optional, Deprecated) The channel IDs that the bot should listen on.
   *   - {ClientOptions} [options.clientOptions] (Optional) Additional options to configure the client.
   *   - {string} [options.commandsDirectory] The directory containing the commands for the bot.
   *   - {string} [options.eventsDirectory] The directory containing the events for the bot.
   */
  constructor(options: DiscordBotOptions) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      ...options.clientOptions,
    });
    this.botToken = options.botToken;
    this.triggers = options.eventTriggers;
    this.eventsDirectory = options.eventsDirectory;

    // Grab all the command files
    this.commands = new Collection();
    const foldersPath = path.join(
      __dirname,
      options.commandsDirectory ?? "commands"
    );
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".ts"));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath).default as Command;
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if (command.data) {
          this.commands.set(command.data.name, command);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }
  }

  logon() {
    // init all the events
    const eventsPath = path.join(__dirname, this.eventsDirectory ?? "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath).default;
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args, this));
      } else {
        this.on(event.name, (...args) => event.execute(...args, this));
      }
    }

    this.login(this.botToken);
  }
}
