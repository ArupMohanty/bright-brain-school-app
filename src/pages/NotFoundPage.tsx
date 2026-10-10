import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page">
      <h1>Page not found</h1>
      <p>Sorry, we could not find that page.</p>
      <Link className="button" to="/">
        Back to home
      </Link>
    </div>
  );
}
