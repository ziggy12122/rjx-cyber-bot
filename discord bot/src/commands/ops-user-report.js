import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { hasConsent } from '../utils/consent.js';

export const data = new SlashCommandBuilder()
  .setName('ops-user-report')
  .setDescription('Generate an educational Discord user profile report (requires consent)')
  .addUserOption(opt =>
    opt.setName('user').setDescription('Target user (defaults to you)').setRequired(false)
  );

export async function execute(interaction) {
  const targetUser = interaction.options.getUser('user') || interaction.user;

  if (!hasConsent(targetUser.id)) {
    await interaction.reply({
      ephemeral: true,
      content:
        'This report requires explicit consent from the target user. ' +
        'Ask them to run `/consent opt-in` first.',
    });
    return;
  }

  const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
  const roles = member?.roles?.cache
    ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.name)
    : [];

  const report = {
    target: {
      id: targetUser.id,
      username: targetUser.username,
      discriminator: targetUser.discriminator,
      bot: targetUser.bot,
    },
    guild: {
      id: interaction.guild.id,
      name: interaction.guild.name,
      joinedAt: member?.joinedAt?.toISOString() || null,
      roles: Array.from(roles.values()),
    },
    account: {
      createdAt: targetUser.createdAt?.toISOString() || null,
      avatarUrl: targetUser.displayAvatarURL({ size: 256, extension: 'png' }),
      banner: targetUser.banner || null,
    },
    ethics: {
      ipOrIspCollected: false,
      note:
        'Discord bots cannot access user IP addresses or ISP details. ' +
        'This report is limited to public/profile and guild-visible information.',
    },
  };

  const embed = brandEmbed()
    .setTitle('User Report')
    .setDescription(
      [
        `Target: ${targetUser.tag} (${targetUser.id})`,
        `Joined Guild: ${report.guild.joinedAt || 'unknown'}`,
        `Roles: ${roles.length ? roles.join(', ') : 'none'}`,
        'IP/ISP: not collected; not accessible via Discord API.',
      ].join('\n')
    )
    .setThumbnail(report.account.avatarUrl);

  const json = Buffer.from(JSON.stringify(report, null, 2), 'utf-8');
  const file = new AttachmentBuilder(json, { name: 'user-report.json' });

  await interaction.reply({
    embeds: [embed],
    files: [file],
    ephemeral: true,
  });
}
