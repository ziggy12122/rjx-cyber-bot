import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { isProUser, proOnlyReply } from '../utils/proGate.js';

export const data = new SlashCommandBuilder()
  .setName('recon-search-level-4')
  .setDescription('Deep username hunt and analysis (Pro)')
  .addStringOption(opt =>
    opt.setName('username').setDescription('Target username').setRequired(true)
  );

export async function execute(interaction) {
  if (!isProUser(interaction.user.id)) {
    await proOnlyReply(interaction, 'recon-search-level-4');
    return;
  }
  const username = interaction.options.getString('username', true);
  const embed = brandEmbed()
    .setTitle('Recon: Level-4 Username Hunt')
    .setDescription(
      [
        `Username: ${username}`,
        'Runtime ~15 min. You will receive a detailed PDF report.',
        'Note: Higher quota usage; ensure authorization.',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
