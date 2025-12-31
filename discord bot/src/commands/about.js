import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed, link } from '../utils/embeds.js';
import { config } from '../config.js';

export const data = new SlashCommandBuilder()
  .setName('about')
  .setDescription('Basic BosINT info, version, and links');

export async function execute(interaction) {
  const embed = brandEmbed()
    .setTitle(`${config.brand} — About`)
    .setDescription(
      [
        `BosINT provides ethical investigation tools and automation.`,
        `Version: ${config.version}`,
        `Links: ${link('Terms of Service', 'https://example.com/tos')} | ${link('Invite Bot', 'https://discord.com/oauth2/authorize?client_id=' + (config.clientId || 'YOUR_CLIENT_ID') + '&scope=bot%20applications.commands')}`,
        `Summary: Help, chat relay, and Pro-gated recon placeholders.`,
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed] });
}
