import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

describe('App routing', () => {
  it('shows the BrightBrain heading on the home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'BrightBrain' }),
    ).toBeInTheDocument();
  });

  it('shows a not-found page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/nowhere']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
