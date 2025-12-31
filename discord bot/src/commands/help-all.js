import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';

export const data = new SlashCommandBuilder()
  .setName('help-all')
  .setDescription('Full commands list');

export async function execute(interaction) {
  const embed = brandEmbed()
    .setTitle('All Commands')
    .setDescription(
      [
        'General:',
        '- `/about`',
        '- `/help`, `/help-all`, `/help-pro`',
        '- `/bosint-chat [message] (+attachments)`',
        '',
        'Recon (Pro):',
        '- `/recon-whodat <email|url|ip|attachment>`',
        '- `/recon-nmap <target> mode:<dns|intense|ping|vuln|stealthy|web>`',
        '- `/ghost-super-scraper <url>`',
        '- `/ops-email-pwned <email>`',
        '- `/intel-ip-cam [location?]`',
        '- `/recon-search-level-4 <username>`',
        '- `/ghost-scrape-webpage <url>`',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
