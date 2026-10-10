import { Link } from 'react-router-dom';
import { KEY_STAGE_BY_YEAR } from '../data/schema';
import { getQuestions } from '../utils/questions';

const YEARS = [5, 6, 7, 8, 9, 10] as const;

const GROUPS = [
  { keyStage: 'KS2', title: 'Key Stage 2', note: 'Ages 9 to 11' },
  { keyStage: 'KS3', title: 'Key Stage 3', note: 'Ages 11 to 14' },
  { keyStage: 'KS4', title: 'Start of GCSE', note: 'Age 14 to 15' },
] as const;

function questionCount(count: number): string {
  return count === 1 ? '1 question' : `${count} questions`;
}

export function YearPicker() {
  return (
    <section id="years" className="section" aria-labelledby="years-heading">
      <div className="container">
        <h2 id="years-heading">Choose your year</h2>
        <p className="section-intro">Pick a year group to start practising maths.</p>
        {GROUPS.map((group) => (
          <div key={group.keyStage} className="year-group">
            <h3>
              {group.title} <span className="year-group-note">{group.note}</span>
            </h3>
            <ul className="year-list">
              {YEARS.filter((year) => KEY_STAGE_BY_YEAR[year] === group.keyStage).map(
                (year) => {
                  const count = getQuestions('maths', year).length;
                  return (
                    <li key={year}>
                      {count > 0 ? (
                        <Link className="year-card" to={`/quiz/maths/${year}`}>
                          <span className="year-card-title">Year {year}</span>
                          <span>Maths · {questionCount(count)}</span>
                        </Link>
                      ) : (
                        <div className="year-card year-card--soon">
                          <span className="year-card-title">Year {year}</span>
                          <span>Coming soon</span>
                        </div>
                      )}
                    </li>
                  );
                },
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
