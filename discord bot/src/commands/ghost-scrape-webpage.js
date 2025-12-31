import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { isProUser, proOnlyReply } from '../utils/proGate.js';

export const data = new SlashCommandBuilder()
  .setName('ghost-scrape-webpage')
  .setDescription('Download page + resources to ZIP; extract basic PII (Pro)')
  .addStringOption(opt =>
    opt.setName('url').setDescription('Page URL').setRequired(true)
  );

export async function execute(interaction) {
  if (!isProUser(interaction.user.id)) {
    await proOnlyReply(interaction, 'ghost-scrape-webpage');
    return;
  }
  const url = interaction.options.getString('url', true);
  const embed = brandEmbed()
    .setTitle('Ghost: Scrape Webpage')
    .setDescription(
      [
        `Target: ${url}`,
        'Output: ZIP + summary JSON/TXT with confidence tags.',
        'Ethics: Respect robots.txt and terms of service.',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
