import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { isProUser, proOnlyReply } from '../utils/proGate.js';

export const data = new SlashCommandBuilder()
  .setName('ghost-super-scraper')
  .setDescription('Full-site grab and summary (Pro)')
  .addStringOption(opt =>
    opt.setName('url').setDescription('Site URL').setRequired(true)
  );

export async function execute(interaction) {
  if (!isProUser(interaction.user.id)) {
    await proOnlyReply(interaction, 'ghost-super-scraper');
    return;
  }
  const url = interaction.options.getString('url', true);
  const embed = brandEmbed()
    .setTitle('Ghost Super Scraper')
    .setDescription(
      [
        `Target: ${url}`,
        'Task queued: HTML, assets, headers, certs, DNS, HSTS, geolocation, archive.',
        'Output: Zipped export + JSON summary; use ethically.',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
