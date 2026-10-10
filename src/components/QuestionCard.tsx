import type { FormEvent, Ref } from 'react';
import type { Question } from '../data/schema';

type QuestionCardProps = {
  question: Question;
  position: number;
  total: number;
  selected: number | null;
  checked: boolean;
  headingRef: Ref<HTMLHeadingElement>;
  onSelect: (index: number) => void;
  onSubmit: () => void;
};

export function QuestionCard({
  question,
  position,
  total,
  selected,
  checked,
  headingRef,
  onSelect,
  onSubmit,
}: QuestionCardProps) {
  const isCorrect = checked && selected === question.correctIndex;
  const isLast = position === total;
  const buttonLabel = !checked
    ? 'Check answer'
    : isLast
      ? 'See my results'
      : 'Next question';

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (checked || selected !== null) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="quiz-progress">
        Question {position} of {total} · {question.topic}
      </p>
      <h2 ref={headingRef} tabIndex={-1} id={`${question.id}-question`}>
        {question.question}
      </h2>
      <fieldset className="quiz-fieldset" aria-labelledby={`${question.id}-question`}>
        {question.options.map((option, index) => {
          const isCorrectOption = checked && index === question.correctIndex;
          const isWrongChoice = checked && index === selected && !isCorrectOption;
          const classes = [
            'option',
            selected === index ? 'option--selected' : '',
            isCorrectOption ? 'option--correct' : '',
            isWrongChoice ? 'option--wrong' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <label key={option} className={classes}>
              <input
                type="radio"
                name={question.id}
                checked={selected === index}
                onChange={() => {
                  if (!checked) onSelect(index);
                }}
              />
              <span>{option}</span>
              {isCorrectOption && <span className="option-note">Correct answer</span>}
              {isWrongChoice && <span className="option-note">Your answer</span>}
            </label>
          );
        })}
      </fieldset>

      <div role="status" className="feedback-region">
        {checked && (
          <div
            className={`feedback ${isCorrect ? 'feedback--correct' : 'feedback--wrong'}`}
          >
            <p className="feedback-title">
              {isCorrect ? 'Well done, that is correct!' : 'Not quite, but good try!'}
            </p>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>

      <button className="button" type="submit" disabled={!checked && selected === null}>
        {buttonLabel}
      </button>
    </form>
  );
}
