const FEATURES = [
  {
    title: 'Follows the curriculum',
    text: 'Questions for Years 5 to 10 follow the England National Curriculum, from KS2 to the start of GCSE.',
    icon: 'M4 5h7a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4zM20 5h-7a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h8z',
  },
  {
    title: 'Kind explanations',
    text: 'Every answer comes with a short, friendly explanation, so mistakes become a chance to learn.',
    icon: 'M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3zM9.5 20h5',
  },
  {
    title: 'Works offline',
    text: 'Install it on a phone or tablet and practise anywhere, even without an internet connection.',
    icon: 'M5 12.5l4.5 4.5L19 7.5',
  },
  {
    title: 'Private by design',
    text: 'No accounts, no adverts and no tracking. Nothing you do leaves your device.',
    icon: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z',
  },
] as const;

export function FeatureList() {
  return (
    <section
      id="features"
      className="section section--tint"
      aria-labelledby="features-heading"
    >
      <div className="container">
        <h2 id="features-heading">Why children and parents like BrightBrain</h2>
        <ul className="feature-list">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="feature">
              <svg
                className="feature-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={feature.icon} />
              </svg>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
