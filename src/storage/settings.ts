import { openDB } from 'idb';
import { z } from 'zod';

/**
 * Settings are kept on this device only, in IndexedDB. Bump DB_VERSION and add
 * a step to `upgrade` whenever the stored shape changes.
 */
const DB_NAME = 'brightbrain';
const DB_VERSION = 1;
const SETTINGS_STORE = 'settings';
const THEME_KEY = 'theme';

export const themeSchema = z.enum(['light', 'dark']);
export type Theme = z.infer<typeof themeSchema>;

function openDatabase() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore(SETTINGS_STORE);
      }
    },
  });
}

/** Returns the saved theme, or null if none is saved or storage is unavailable. */
export async function loadTheme(): Promise<Theme | null> {
  try {
    const db = await openDatabase();
    const value: unknown = await db.get(SETTINGS_STORE, THEME_KEY);
    db.close();
    const parsed = themeSchema.safeParse(value);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Saves the theme. Fails quietly (for example in a private window) so the app keeps working. */
export async function saveTheme(theme: Theme): Promise<void> {
  try {
    const db = await openDatabase();
    await db.put(SETTINGS_STORE, theme, THEME_KEY);
    db.close();
  } catch {
    // Storage can be blocked; the chosen theme still applies for this visit.
  }
}
