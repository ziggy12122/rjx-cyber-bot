import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { isProUser, proOnlyReply } from '../utils/proGate.js';

export const data = new SlashCommandBuilder()
  .setName('recon-whodat')
  .setDescription('AI-powered scan for phishing/malicious indicators')
  .addStringOption(opt =>
    opt.setName('input')
      .setDescription('email | url | ip')
      .setRequired(false)
  )
  .addAttachmentOption(opt =>
    opt.setName('attachment')
      .setDescription('optional file to analyze')
      .setRequired(false)
  );

export async function execute(interaction) {
  if (!isProUser(interaction.user.id)) {
    await proOnlyReply(interaction, 'recon-whodat');
    return;
  }
  const embed = brandEmbed()
    .setTitle('Recon: WhoDat')
    .setDescription(
      [
        'Scan queued. You will receive an embed + JSON/PDF report.',
        'Includes IOCs, verdict, and confidence scoring.',
        'Reminder: Use only with explicit authorization.',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
