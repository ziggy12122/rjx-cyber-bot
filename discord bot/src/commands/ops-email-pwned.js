import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { isProUser, proOnlyReply } from '../utils/proGate.js';

export const data = new SlashCommandBuilder()
  .setName('ops-email-pwned')
  .setDescription('Breach lookup for an email (Pro)')
  .addStringOption(opt =>
    opt.setName('email').setDescription('Email address').setRequired(true)
  );

export async function execute(interaction) {
  if (!isProUser(interaction.user.id)) {
    await proOnlyReply(interaction, 'ops-email-pwned');
    return;
  }
  const email = interaction.options.getString('email', true);
  const embed = brandEmbed()
    .setTitle('Ops: Email Breach Lookup')
    .setDescription(
      [
        `Email: ${email}`,
        'Result will include what leaked, sources, and dates.',
        'Privacy notice: Do not misuse personal data.',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
