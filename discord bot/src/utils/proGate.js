export function isProUser(userId) {
  return false;
}

export function proOnlyReply(interaction, featureName) {
  return interaction.reply({
    ephemeral: true,
    content:
      `This feature (${featureName}) is Pro-only. ` +
      `Upgrade to access automated scanning and full reports.\n` +
      `Use responsibly and only with explicit authorization.`,
  });
}
