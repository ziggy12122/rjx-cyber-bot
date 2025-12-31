import fs from 'node:fs';
import path from 'node:path';

export async function loadCommands() {
  const commands = new Map();
  const commandsDir = path.join(process.cwd(), 'src', 'commands');
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const modulePath = path.join(commandsDir, file);
    const mod = await import(pathToFileURL(modulePath).href);
    if (mod?.data?.name && typeof mod.execute === 'function') {
      commands.set(mod.data.name, mod);
    }
  }
  return commands;
}

function pathToFileURL(p) {
  const resolved = path.resolve(p);
  const prefix = 'file:///';
  const normalized = resolved.replace(/\\/g, '/');
  return { href: `${prefix}${normalized}` };
}
