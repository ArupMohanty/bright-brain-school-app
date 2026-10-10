import { FeatureList } from '../components/FeatureList';
import { YearPicker } from '../components/YearPicker';

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">Years 5 to 10 · KS2, KS3 and GCSE start</p>
            <h1 id="hero-heading">Practise smarter. Feel more confident.</h1>
            <p className="hero-text">
              Short multiple-choice questions with friendly explanations, made for the
              England National Curriculum.
            </p>
            <a className="button" href="#years">
              Choose your year
            </a>
          </div>
          <div className="hero-card" aria-hidden="true">
            <p className="hero-card-label">Year 5 · Fractions</p>
            <p className="hero-card-question">What is 3/4 of 20?</p>
            <span className="hero-card-option">12</span>
            <span className="hero-card-option hero-card-option--right">15 ✓</span>
            <span className="hero-card-option">16</span>
          </div>
        </div>
      </section>

      <YearPicker />
      <FeatureList />

      <section className="section cta" aria-labelledby="cta-heading">
        <div className="container">
          <h2 id="cta-heading">Ready to start?</h2>
          <p className="section-intro">Pick a year and try your first question.</p>
          <a className="button" href="#years">
            Choose your year
          </a>
        </div>
      </section>
    </>
  );
}
