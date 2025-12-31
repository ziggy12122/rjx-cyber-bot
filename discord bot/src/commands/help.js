import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Basic help: key commands and usage');

export async function execute(interaction) {
  const embed = brandEmbed()
    .setTitle('Help')
    .setDescription(
      [
        '`/about` — Bot info and links',
        '`/bosint-chat [message] (+attachments)` — Relay to BosINT hub',
        '`/help-all` — Full command list',
        '`/help-pro` — Pro-only features overview',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
