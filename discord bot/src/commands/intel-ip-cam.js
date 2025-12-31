import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { isProUser, proOnlyReply } from '../utils/proGate.js';

export const data = new SlashCommandBuilder()
  .setName('intel-ip-cam')
  .setDescription('Discover unsecured IP camera feeds (use ethically)')
  .addStringOption(opt =>
    opt.setName('location').setDescription('Optional location keyword').setRequired(false)
  );

export async function execute(interaction) {
  if (!isProUser(interaction.user.id)) {
    await proOnlyReply(interaction, 'intel-ip-cam');
    return;
  }
  const location = interaction.options.getString('location') || 'random';
  const embed = brandEmbed()
    .setTitle('Intel: IP Camera')
    .setDescription(
      [
        `Search: ${location}`,
        'A link or snapshot will be provided if available.',
        'Ethics: Never access private devices; accuracy varies.',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
