import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { optIn, optOut, hasConsent } from '../utils/consent.js';

export const data = new SlashCommandBuilder()
  .setName('consent')
  .setDescription('Manage consent for generating your user report')
  .addSubcommand(sc => sc.setName('opt-in').setDescription('Allow generating your report'))
  .addSubcommand(sc => sc.setName('opt-out').setDescription('Revoke permission for your report'));

export async function execute(interaction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'opt-in') {
    optIn(interaction.user.id);
    const embed = brandEmbed()
      .setTitle('Consent: Opt-In')
      .setDescription('You have granted permission to generate your user report.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }
  if (sub === 'opt-out') {
    optOut(interaction.user.id);
    const embed = brandEmbed()
      .setTitle('Consent: Opt-Out')
      .setDescription('You have revoked permission. Reports will not be generated for you.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }
  const state = hasConsent(interaction.user.id) ? 'opted-in' : 'opted-out';
  await interaction.reply({ content: `You are currently ${state}.`, ephemeral: true });
}
