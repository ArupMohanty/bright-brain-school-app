import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('Home page', () => {
  it('has a main heading and a single main landmark', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Practise smarter',
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'BrightBrain' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('links to year groups that have questions', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: /Year 5/ })).toHaveAttribute(
      'href',
      '/quiz/maths/5',
    );
  });

  it('shows years without questions as coming soon, not as links', () => {
    renderAt('/');
    expect(screen.queryByRole('link', { name: /Year 9/ })).not.toBeInTheDocument();
    expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0);
  });

  it('explains the privacy approach', () => {
    renderAt('/');
    expect(
      screen.getByRole('heading', { name: 'Private by design' }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderAt('/');
    expect((await axe(container)).violations).toEqual([]);
  });
});

describe('App routing', () => {
  it('shows a not-found page for unknown routes', () => {
    renderAt('/nowhere');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
