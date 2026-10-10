import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link className="logo" to="/">
            <span className="logo-mark" aria-hidden="true">
              B
            </span>
            BrightBrain
          </Link>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p className="footer-title">BrightBrain</p>
          <p>
            Multiple-choice practice for Years 5 to 10, following the England National
            Curriculum.
          </p>
          <p>
            No accounts, no adverts and no tracking. Nothing you do leaves your device.
          </p>
        </div>
      </footer>
    </>
  );
}
