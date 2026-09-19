import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          Trust<span>Lens</span>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <button className="nav-btn">Get Started</button>
      </header>

      <main id="home">
        <section className="hero-section">
          <div className="hero-content">
            <p className="badge">AI-Powered Trust & Risk Intelligence</p>

            <h1>
              See the Risk.
              <br />
              <span>Know the Truth.</span>
            </h1>

            <p className="hero-text">
              TrustLens helps identify suspicious patterns, analyze evidence,
              and generate intelligent risk insights from project data.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">Explore TrustLens</button>
              <button className="secondary-btn">Learn More</button>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-header">
              <span>Risk Intelligence</span>
              <span className="status">● LIVE</span>
            </div>

            <div className="risk-score">
              <div className="score">78</div>
              <div>
                <p>Risk Score</p>
                <small>Needs Attention</small>
              </div>
            </div>

            <div className="risk-bar">
              <div></div>
            </div>

            <div className="risk-items">
              <div>
                <span>Budget Anomaly</span>
                <b>Detected</b>
              </div>

              <div>
                <span>Evidence Check</span>
                <b>Review</b>
              </div>

              <div>
                <span>Project Progress</span>
                <b>72%</b>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <p className="section-label">WHY TRUSTLENS</p>

          <h2>Turn project data into actionable intelligence.</h2>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">◉</div>
              <h3>AI Risk Detection</h3>
              <p>
                Analyze project information and identify unusual or suspicious
                patterns.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⌁</div>
              <h3>Evidence Analysis</h3>
              <p>
                Examine submitted evidence and highlight information that
                requires verification.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">↗</div>
              <h3>Smart Insights</h3>
              <p>
                Convert complex project data into clear and understandable risk
                insights.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
