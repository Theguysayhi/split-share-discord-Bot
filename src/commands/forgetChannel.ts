import {
  ChannelType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../types/command";
import { TenantRepository } from "../db/repositories";

const tenantRepo = new TenantRepository();

export default {
  data: new SlashCommandBuilder()
    .setName("forgetchannel")
    .setDescription("Deregister a channel from split payments")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to deregister")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  global: true,
  execute: async (interaction) => {
    const channel = interaction.options.getChannel("channel", true);
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: "This command can only be used inside a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const tenant = await tenantRepo.findByServerAndChannelId(guildId, channel.id);
    if (!tenant) {
      await interaction.reply({
        content: `<#${channel.id}> is not registered for split payments.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await tenantRepo.delete(tenant.id);

    await interaction.reply({
      content: `✅ <#${channel.id}> has been deregistered from split payments.`,
      flags: MessageFlags.Ephemeral,
    });
  },
} as Command;
