import { DiscordBot } from "./classes/discordBot";

export const splitcordBot = new DiscordBot({
    botToken: process.env.DISCORD_TOKEN,
    commandsDirectory: './commands',
    eventsDirectory: './events',
  });

splitcordBot.logon();
