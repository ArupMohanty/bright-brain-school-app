import type { Ref } from 'react';
import { Link } from 'react-router-dom';

type QuizResultsProps = {
  score: number;
  total: number;
  headingRef: Ref<HTMLHeadingElement>;
  onRestart: () => void;
};

function encouragement(score: number, total: number): string {
  const share = score / total;
  if (share === 1) return 'Brilliant! You got every question right.';
  if (share >= 0.5) return 'Great effort! Have another go to improve even more.';
  return 'Good try! Every practice makes you stronger. Have another go.';
}

export function QuizResults({ score, total, headingRef, onRestart }: QuizResultsProps) {
  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" ref={headingRef} tabIndex={-1}>
        You got {score} out of {total}
      </h2>
      <p>{encouragement(score, total)}</p>
      <div className="actions">
        <button className="button" type="button" onClick={onRestart}>
          Try again
        </button>
        <Link className="button button--secondary" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
