import { DiscordAIBot } from "@/discordBot";
import { ChatInputCommandInteraction, Events } from "discord.js";

export type Event = {
    name: Events,
    once?: boolean,
    execute: (interaction: ChatInputCommandInteraction, context?: DiscordAIBot) => Promise<void>
};