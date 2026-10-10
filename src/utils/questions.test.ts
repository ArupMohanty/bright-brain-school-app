import { filterQuestions, getQuestions, parseQuestionFiles } from './questions';

const valid = {
  id: 'maths-y5-900',
  subject: 'maths',
  keyStage: 'KS2',
  year: 5,
  topic: 'Fractions',
  question: 'What is half of 10?',
  options: ['4', '5'],
  correctIndex: 1,
  explanation: 'Half of 10 is 5.',
};

describe('questions', () => {
  it('flattens valid files into one list', () => {
    const parsed = parseQuestionFiles([[valid], [{ ...valid, id: 'maths-y5-901' }]]);
    expect(parsed).toHaveLength(2);
  });

  it('rejects invalid question data', () => {
    expect(() => parseQuestionFiles([[{ ...valid, correctIndex: 9 }]])).toThrow();
  });

  it('filters by subject and year', () => {
    const all = parseQuestionFiles([[valid]]);
    expect(filterQuestions(all, 'maths', 5)).toHaveLength(1);
    expect(filterQuestions(all, 'maths', 6)).toHaveLength(0);
    expect(filterQuestions(all, undefined, 5)).toHaveLength(0);
  });

  it('loads the bundled Year 5 maths questions', () => {
    expect(getQuestions('maths', 5).length).toBeGreaterThan(0);
  });
});
