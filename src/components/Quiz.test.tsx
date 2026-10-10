import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import type { Question } from '../data/schema';
import { Quiz } from './Quiz';

const questions: Question[] = [
  {
    id: 'maths-y5-901',
    subject: 'maths',
    keyStage: 'KS2',
    year: 5,
    topic: 'Fractions',
    question: 'What is half of 10?',
    options: ['4', '5', '6'],
    correctIndex: 1,
    explanation: 'Half of 10 is 5.',
  },
  {
    id: 'maths-y5-902',
    subject: 'maths',
    keyStage: 'KS2',
    year: 5,
    topic: 'Place value',
    question: 'What is 3,000 + 400 + 5?',
    options: ['345', '3,405'],
    correctIndex: 1,
    explanation: 'It makes 3,405.',
  },
];

function renderQuiz() {
  return render(
    <MemoryRouter>
      <Quiz questions={questions} />
    </MemoryRouter>,
  );
}

describe('Quiz', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderQuiz();
    expect((await axe(container)).violations).toEqual([]);
  });

  it('cannot check an answer until one is chosen', () => {
    renderQuiz();
    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled();
  });

  it('praises a correct answer and shows the explanation', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await user.click(screen.getByRole('radio', { name: '5' }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('Well done');
    expect(screen.getByRole('status')).toHaveTextContent('Half of 10 is 5.');
  });

  it('is kind about a wrong answer and shows the right one', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await user.click(screen.getByRole('radio', { name: '4' }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(screen.getByRole('status')).toHaveTextContent('Not quite, but good try');
    expect(screen.getByText('Correct answer')).toBeInTheDocument();
    expect(screen.getByText('Your answer')).toBeInTheDocument();
  });

  it('locks the answer once checked', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await user.click(screen.getByRole('radio', { name: '4' }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    await user.click(screen.getByRole('radio', { name: /^5/ }));
    expect(screen.getByRole('radio', { name: /^4/ })).toBeChecked();
  });

  it('moves focus to the next question heading', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await user.click(screen.getByRole('radio', { name: '5' }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    await user.click(screen.getByRole('button', { name: 'Next question' }));
    expect(
      screen.getByRole('heading', { name: 'What is 3,000 + 400 + 5?' }),
    ).toHaveFocus();
    expect(screen.getByText(/Question 2 of 2/)).toBeInTheDocument();
  });

  it('shows the score at the end and can restart', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await user.click(screen.getByRole('radio', { name: '5' }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    await user.click(screen.getByRole('button', { name: 'Next question' }));
    await user.click(screen.getByRole('radio', { name: '345' }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    await user.click(screen.getByRole('button', { name: 'See my results' }));

    expect(
      screen.getByRole('heading', { name: 'You got 1 out of 2' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/',
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument();
  });
});
