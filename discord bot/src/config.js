import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  chatHubChannelId: process.env.CHAT_HUB_CHANNEL_ID,
  version: 'v0.1.0',
  brand: 'BosINT',
};
