import { useEffect, useRef, useState } from 'react';
import type { Question } from '../data/schema';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';

type QuizProps = {
  questions: readonly Question[];
};

export function Quiz({ questions }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const question = questions[index];

  // Move focus to the new heading when the question changes, so keyboard and
  // screen reader users start at the top of the new content.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [index]);

  function handleSubmit() {
    if (!question) return;
    if (!checked) {
      setChecked(true);
      if (selected === question.correctIndex) setScore((s) => s + 1);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
  }

  if (!question) {
    return (
      <QuizResults
        score={score}
        total={questions.length}
        headingRef={headingRef}
        onRestart={restart}
      />
    );
  }

  return (
    <QuestionCard
      question={question}
      position={index + 1}
      total={questions.length}
      selected={selected}
      checked={checked}
      headingRef={headingRef}
      onSelect={setSelected}
      onSubmit={handleSubmit}
    />
  );
}
