const optInUsers = new Set();

export function hasConsent(userId) {
  return optInUsers.has(userId);
}

export function optIn(userId) {
  optInUsers.add(userId);
}

export function optOut(userId) {
  optInUsers.delete(userId);
}
