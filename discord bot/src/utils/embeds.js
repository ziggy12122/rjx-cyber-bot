import { EmbedBuilder } from 'discord.js';
import { config } from '../config.js';

export function brandEmbed() {
  return new EmbedBuilder()
    .setColor(0x2f3136)
    .setFooter({ text: `${config.brand} ${config.version}` });
}

export function link(name, url) {
  return `[${name}](${url})`;
}
