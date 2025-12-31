import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';

export const data = new SlashCommandBuilder()
  .setName('help-pro')
  .setDescription('Pro features and notes');

export async function execute(interaction) {
  const embed = brandEmbed()
    .setTitle('Pro Features')
    .setDescription(
      [
        'Pro-only capabilities include advanced recon and reporting:',
        '- Automated scans with legal-use enforcement',
        '- PDF/JSON report generation',
        '- Higher quotas for long-running tasks',
        'Use ethically with explicit authorization and within applicable laws.',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
