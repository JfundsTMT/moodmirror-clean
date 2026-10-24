export const LOCAL_KEY = 'journalEntries';

// Entries are stored newest-first.
export function loadEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Could not save entries', err);
  }
}
