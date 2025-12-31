import { SlashCommandBuilder } from 'discord.js';
import { brandEmbed } from '../utils/embeds.js';
import { config } from '../config.js';

export const data = new SlashCommandBuilder()
  .setName('bosint-chat')
  .setDescription('Cross-server chat relay to BosINT hub')
  .addStringOption(opt =>
    opt.setName('message').setDescription('Message to relay').setRequired(true)
  )
  .addAttachmentOption(opt =>
    opt.setName('file1').setDescription('Optional attachment 1').setRequired(false)
  )
  .addAttachmentOption(opt =>
    opt.setName('file2').setDescription('Optional attachment 2').setRequired(false)
  )
  .addAttachmentOption(opt =>
    opt.setName('file3').setDescription('Optional attachment 3').setRequired(false)
  );

export async function execute(interaction) {
  const message = interaction.options.getString('message', true);
  const a1 = interaction.options.getAttachment('file1');
  const a2 = interaction.options.getAttachment('file2');
  const a3 = interaction.options.getAttachment('file3');
  const files = [a1, a2, a3]
    .filter(Boolean)
    .map(att => ({ attachment: att.url, name: att.name || 'attachment' }));

  if (!config.chatHubChannelId) {
    const embed = brandEmbed()
      .setTitle('BosINT Chat')
      .setDescription('Hub channel not configured. Set `CHAT_HUB_CHANNEL_ID` in `.env`.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  const hub = await interaction.client.channels.fetch(config.chatHubChannelId).catch(() => null);
  if (!hub || !hub.isTextBased()) {
    await interaction.reply({ content: 'Hub channel not found or not text-based.', ephemeral: true });
    return;
  }

  await hub.send({
    content: `**${interaction.user.tag}**: ${message}`,
    files,
    allowedMentions: { parse: [] },
  });

  await interaction.reply({ content: 'Message relayed to BosINT hub.', ephemeral: true });
}
