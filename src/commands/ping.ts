import {
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../types/command";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is running or not"),
  global: true,
  execute: async (interaction, context) => {
    interaction.reply({
      content: "Yes yes! I'm on the case!",
      flags: MessageFlags.Ephemeral,
    });
  },
} as Command;
