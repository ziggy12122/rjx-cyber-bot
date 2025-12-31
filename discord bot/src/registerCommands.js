import { REST, Routes } from '@discordjs/rest';
import { config } from './config.js';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

async function collectCommandData() {
  const commandsDir = path.join(process.cwd(), 'src', 'commands');
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
  const body = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(commandsDir, file)).href);
    if (mod?.data?.toJSON) {
      body.push(mod.data.toJSON());
    }
  }
  return body;
}

function pathToFileURL(p) {
  const resolved = path.resolve(p).replace(/\\/g, '/');
  return { href: `file:///${resolved}` };
}

async function register() {
  if (!config.token || !config.clientId) {
    console.error('Missing DISCORD_TOKEN or CLIENT_ID in environment.');
    process.exit(1);
  }
  const rest = new REST({ version: '10' }).setToken(config.token);
  const body = await collectCommandData();
  const useGuild = process.argv.includes('--guild') && !!config.guildId;
  try {
    if (useGuild) {
      const route = Routes.applicationGuildCommands(config.clientId, config.guildId);
      await rest.put(route, { body });
      console.log(`Registered ${body.length} commands to guild ${config.guildId}`);
    } else {
      const route = Routes.applicationCommands(config.clientId);
      await rest.put(route, { body });
      console.log(`Registered ${body.length} global commands`);
      console.log('Global updates can take up to an hour to propagate.');
    }
  } catch (err) {
    console.error('Failed to register commands:', err);
    process.exit(1);
  }
}

register();
