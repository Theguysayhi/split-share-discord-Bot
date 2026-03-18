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
    .setName("registerchannel")
    .setDescription("Register a channel for split payments")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to register")
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

    const existing = await tenantRepo.findByServerAndChannelId(guildId, channel.id);
    if (existing) {
      await interaction.reply({
        content: `<#${channel.id}> is already registered for split payments.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await tenantRepo.create({
      name: channel.name ?? channel.id,
      serverId: guildId,
      channelId: channel.id,
    });

    await interaction.reply({
      content: `✅ <#${channel.id}> has been registered for split payments!`,
      flags: MessageFlags.Ephemeral,
    });
  },
} as Command;
