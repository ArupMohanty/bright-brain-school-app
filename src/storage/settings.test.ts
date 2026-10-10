import 'fake-indexeddb/auto';
import { loadTheme, saveTheme } from './settings';

describe('theme setting', () => {
  it('returns null when nothing has been saved', async () => {
    expect(await loadTheme()).toBeNull();
  });

  it('saves and loads the theme', async () => {
    await saveTheme('dark');
    expect(await loadTheme()).toBe('dark');
    await saveTheme('light');
    expect(await loadTheme()).toBe('light');
  });
});
