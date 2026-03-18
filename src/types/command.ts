import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { DiscordBot } from "../classes/discordBot";

export type Command = {
    data: SlashCommandBuilder,
    global?: boolean,
    execute: (interaction: ChatInputCommandInteraction, context?: DiscordBot) => Promise<void>
};
