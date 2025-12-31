import nacl from 'tweetnacl';
import getRawBody from 'raw-body';

function hexToUint8(hex) {
  if (!hex) return new Uint8Array();
  const arr = hex.match(/.{1,2}/g).map(b => parseInt(b, 16));
  return new Uint8Array(arr);
}

function verifySignature(req, raw) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const publicKey = process.env.PUBLIC_KEY;
  if (!signature || !timestamp || !publicKey) return false;
  const msg = Buffer.from(timestamp + raw.toString('utf-8'));
  const sig = Buffer.from(signature, 'hex');
  const key = Buffer.from(publicKey, 'hex');
  return nacl.sign.detached.verify(msg, sig, key);
}

function ephemeral(data) {
  return { type: 4, data: { ...data, flags: 64 } };
}

function embed({ title, description }) {
  return {
    type: 4,
    data: {
      embeds: [
        {
          title,
          description,
          color: 3092790,
          footer: { text: 'BosINT v0.1.0' },
        },
      ],
    },
  };
}

function getOption(interaction, name) {
  const opts = interaction?.data?.options || [];
  return opts.find(o => o.name === name)?.value;
}

function getResolvedAttachments(interaction) {
  const res = interaction?.data?.resolved?.attachments;
  if (!res) return [];
  return Object.values(res);
}

async function postToHub(content, attachments) {
  const token = process.env.DISCORD_TOKEN;
  const channelId = process.env.CHAT_HUB_CHANNEL_ID;
  if (!token || !channelId) return false;
  const attUrls = attachments.map(a => a.url);
  const body = {
    content: `${content}${attUrls.length ? '\n' + attUrls.join('\n') : ''}`,
    allowedMentions: { parse: [] },
  };
  const resp = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return resp.ok;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const raw = await getRawBody(req);
  if (!verifySignature(req, raw)) {
    res.status(401).send('Bad signature');
    return;
  }
  const interaction = JSON.parse(raw.toString('utf-8'));

  if (interaction.type === 1) {
    res.status(200).json({ type: 1 });
    return;
  }

  if (interaction.type === 2) {
    const name = interaction.data.name;
    if (name === 'about') {
      res.status(200).json(
        embed({
          title: 'BosINT — About',
          description:
            'BosINT provides ethical investigation tools and automation.\n' +
            'Links: Terms of Service and Invite available in app.\n' +
            'Summary: Help, chat relay, and Pro-gated recon placeholders.',
        })
      );
      return;
    }
    if (name === 'help') {
      res.status(200).json(
        ephemeral({
          embeds: [
            {
              title: 'Help',
              description:
                '`/about` — Bot info and links\n' +
                '`/bosint-chat [message] (+attachments)` — Relay to BosINT hub\n' +
                '`/help-all` — Full command list\n' +
                '`/help-pro` — Pro-only features overview',
              color: 3092790,
              footer: { text: 'BosINT v0.1.0' },
            },
          ],
        })
      );
      return;
    }
    if (name === 'help-all') {
      res.status(200).json(
        ephemeral({
          embeds: [
            {
              title: 'All Commands',
              description:
                'General:\n' +
                '- `/about`\n' +
                '- `/help`, `/help-all`, `/help-pro`\n' +
                '- `/bosint-chat [message] (+attachments)`\n\n' +
                'Recon (Pro):\n' +
                '- `/recon-whodat <email|url|ip|attachment>`\n' +
                '- `/recon-nmap <target> mode:<dns|intense|ping|vuln|stealthy|web>`\n' +
                '- `/ghost-super-scraper <url>`\n' +
                '- `/ops-email-pwned <email>`\n' +
                '- `/intel-ip-cam [location?]`\n' +
                '- `/recon-search-level-4 <username>`\n' +
                '- `/ghost-scrape-webpage <url>`',
              color: 3092790,
              footer: { text: 'BosINT v0.1.0' },
            },
          ],
        })
      );
      return;
    }
    if (name === 'help-pro') {
      res.status(200).json(
        ephemeral({
          embeds: [
            {
              title: 'Pro Features',
              description:
                'Pro-only capabilities include advanced recon and reporting:\n' +
                '- Automated scans with legal-use enforcement\n' +
                '- PDF/JSON report generation\n' +
                '- Higher quotas for long-running tasks\n' +
                'Use ethically with explicit authorization and within applicable laws.',
              color: 3092790,
              footer: { text: 'BosINT v0.1.0' },
            },
          ],
        })
      );
      return;
    }
    if (name === 'bosint-chat') {
      const msg = getOption(interaction, 'message') || '';
      const atts = getResolvedAttachments(interaction);
      const userTag = `${interaction.member?.user?.username || 'user'}#${interaction.member?.user?.discriminator || '0000'}`;
      const ok = await postToHub(`**${userTag}**: ${msg}`, atts);
      if (!ok) {
        res.status(200).json(ephemeral({ content: 'Hub channel not configured or request failed.' }));
        return;
      }
      res.status(200).json(ephemeral({ content: 'Message relayed to BosINT hub.' }));
      return;
    }
    if (name === 'ops-user-report') {
      res.status(200).json(
        ephemeral({
          content:
            'Reports require persistent consent storage and gateway events, which are not available on Vercel. ' +
            'Use a database (e.g., Vercel KV/Redis) to store opt-ins, or host the gateway bot separately.',
        })
      );
      return;
    }
    res.status(200).json(ephemeral({ content: 'Unknown command.' }));
    return;
  }

  res.status(400).send('Unsupported interaction type');
}
