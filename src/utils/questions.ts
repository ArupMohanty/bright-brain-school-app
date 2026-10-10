import { questionFileSchema } from '../data/schema';
import type { Question } from '../data/schema';

const files = import.meta.glob('../data/questions/*/year-*.json', {
  eager: true,
  import: 'default',
});

/** Validates raw question JSON and flattens it into one list. */
export function parseQuestionFiles(raw: readonly unknown[]): Question[] {
  return raw.flatMap((file) => questionFileSchema.parse(file));
}

export function filterQuestions(
  questions: readonly Question[],
  subject: string | undefined,
  year: number,
): Question[] {
  return questions.filter((q) => q.subject === subject && q.year === year);
}

const allQuestions = parseQuestionFiles(Object.values(files));

export function getQuestions(subject: string | undefined, year: number): Question[] {
  return filterQuestions(allQuestions, subject, year);
}
