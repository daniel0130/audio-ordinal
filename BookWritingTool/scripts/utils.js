// scripts/utils.js

export function generateId(prefix, length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = prefix;
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function sortEventsChronologically(events) {
  return events.sort((a, b) => {
    // Simple comparison based on date strings; can be enhanced for complex dates
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });
}
