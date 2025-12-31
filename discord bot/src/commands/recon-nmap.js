import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { isProUser, proOnlyReply } from '../utils/proGate.js';

export const data = new SlashCommandBuilder()
  .setName('recon-nmap')
  .setDescription('Remote Nmap scan presets')
  .addStringOption(opt =>
    opt.setName('target').setDescription('Target host or IP').setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName('mode')
      .setDescription('dns | intense | ping | vuln | stealthy | web')
      .addChoices(
        { name: 'dns', value: 'dns' },
        { name: 'intense', value: 'intense' },
        { name: 'ping', value: 'ping' },
        { name: 'vuln', value: 'vuln' },
        { name: 'stealthy', value: 'stealthy' },
        { name: 'web', value: 'web' },
      )
      .setRequired(true)
  );

export async function execute(interaction) {
  if (!isProUser(interaction.user.id)) {
    await proOnlyReply(interaction, 'recon-nmap');
    return;
  }
  const target = interaction.options.getString('target', true);
  const mode = interaction.options.getString('mode', true);
  const embed = brandEmbed()
    .setTitle('Recon: Nmap')
    .setDescription(
      [
        `Mode: ${mode}`,
        `Target: ${target}`,
        'Scan scheduled with legal-use reminder and rate limits.',
        'You will receive an output embed + downloadable report.',
      ].join('\n')
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
