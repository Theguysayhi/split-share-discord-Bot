import logger from "@/logger";
import { Command } from "@/types/command";
import {
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

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

    logger.info({
      message: `ping called.`,
      user: interaction.member?.user.username,
    });

  },
} as Command;
