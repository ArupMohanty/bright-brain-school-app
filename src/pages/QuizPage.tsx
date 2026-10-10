import { Link, useParams } from 'react-router-dom';
import { Quiz } from '../components/Quiz';
import { getQuestions } from '../utils/questions';

export function QuizPage() {
  const { subject, year } = useParams();
  const yearNumber = Number(year);
  const questions = getQuestions(subject, yearNumber);

  if (questions.length === 0) {
    return (
      <div className="page">
        <h1>No questions yet</h1>
        <p>We are still writing questions for this one. Please try another.</p>
        <Link className="button" to="/">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>
        Year {yearNumber} {subject}
      </h1>
      <Quiz key={`${subject}-${yearNumber}`} questions={questions} />
    </div>
  );
}
