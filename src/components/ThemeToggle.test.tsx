import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { loadTheme, saveTheme } from '../storage/settings';
import { ThemeToggle } from './ThemeToggle';

vi.mock('../storage/settings', () => ({
  loadTheme: vi.fn(),
  saveTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.mocked(loadTheme).mockResolvedValue(null);
    vi.mocked(saveTheme).mockResolvedValue(undefined);
    delete document.documentElement.dataset.theme;
  });

  it('starts in light mode when nothing is saved', async () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked();
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('light'));
  });

  it('switches to dark mode and back, saving each choice', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggle = screen.getByRole('switch', { name: 'Dark mode' });

    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(saveTheme).toHaveBeenLastCalledWith('dark');

    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(saveTheme).toHaveBeenLastCalledWith('light');
  });

  it('uses the saved theme', async () => {
    vi.mocked(loadTheme).mockResolvedValue('dark');
    render(<ThemeToggle />);
    await waitFor(() =>
      expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked(),
    );
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ThemeToggle />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
