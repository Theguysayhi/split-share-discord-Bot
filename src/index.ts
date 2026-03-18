import { DiscordBot } from "./classes/discordBot";

export const translationBot = new DiscordBot({
    botToken: process.env.DISCORD_TOKEN,
    commandsDirectory: './commands',
    eventsDirectory: './events',
  });

translationBot.logon();
