import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import { config } from './config.js';
import { loadCommands } from './commandLoader.js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  if (!config.token) {
    console.error('Missing DISCORD_TOKEN in environment.');
    process.exit(1);
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  const commands = await loadCommands();
  client.commands = new Collection();
  for (const [name, mod] of commands.entries()) {
    client.commands.set(name, mod);
  }

  client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`);
  });

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) {
      await interaction.reply({ content: 'Unknown command.', ephemeral: true }).catch(() => {});
      return;
    }
    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: 'Error executing command.' }).catch(() => {});
      } else {
        await interaction.reply({ content: 'Error executing command.', ephemeral: true }).catch(() => {});
      }
    }
  });

  client.on(Events.GuildMemberAdd, async member => {
    try {
      await member.send(
        'Welcome. For educational user reports, you must explicitly consent. ' +
        'Run `/consent opt-in` in the server to allow generating your report. ' +
        'You can revoke with `/consent opt-out` at any time.'
      );
    } catch {}
  });

  await client.login(config.token);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
