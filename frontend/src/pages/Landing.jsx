import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";
import "./Landing.css";

function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      text: "This app completely changed how I track my monthly expenses. The AI insights saved me 25% on unnecessary spending.",
      author: "Akash Patel",
      role: "Software Engineer",
      avatar: "👨‍💻"
    },
    {
      text: "Clean UI, very intuitive, and the insights are actually useful. Our team's budget management has improved dramatically.",
      author: "Priya Sharma",
      role: "Product Manager",
      avatar: "👩‍💼"
    },
    {
      text: "Best expense tracker I've used for personal finance. The export feature helps with my tax preparations immensely.",
      author: "Rahul Verma",
      role: "Freelance Designer",
      avatar: "🎨"
    }
  ];

  const features = [
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Deep insights into your spending patterns with predictive analysis"
    },
    {
      icon: "🤖",
      title: "AI-Powered Insights",
      description: "Get personalized recommendations to optimize your budget"
    },
    {
      icon: "📱",
      title: "Multi-Device Sync",
      description: "Access your data anywhere, anytime across all devices"
    },
    {
      icon: "🔒",
      title: "Bank-Level Security",
      description: "Your financial data is encrypted with military-grade security"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <div className="landing">
        {/* ================= HERO SECTION ================= */}
        <section className="hero-section fade-in">
          <div className="hero-content">
            <h1 className="hero-title">
              Smart Finance Management
              <span className="gradient-text">Powered by AI</span>
            </h1>
            <p className="hero-subtitle">
              Take control of your finances with intelligent budgeting, expense tracking, 
              and predictive insights. Used by over 50,000 professionals worldwide.
            </p>
            <div className="hero-cta">
              <button className="primary-btn" onClick={() => setLoginOpen(true)}>
                Start Free Trial
                <span className="btn-icon">→</span>
              </button>
              <button className="secondary-btn">
                Watch Demo
                <span className="btn-icon">▶</span>
              </button>
            </div>
            <div className="trust-badges">
              <div className="badge">
                <span className="badge-icon">🏆</span>
                <span>Best Finance App 2024</span>
              </div>
              <div className="badge">
                <span className="badge-icon">⭐</span>
                <span>4.9/5 (2k+ reviews)</span>
              </div>
              <div className="badge">
                <span className="badge-icon">👥</span>
                <span>50k+ Users</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card-1">
                <div className="card-header">
                  <span className="card-icon">💰</span>
                  <span>Monthly Budget</span>
                </div>
                <div className="card-amount">₹45,000</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '72%' }}></div>
                </div>
                <div className="card-stats">
                  <span>Spent: ₹32,400</span>
                  <span>Remaining: ₹12,600</span>
                </div>
              </div>
              <div className="card-2">
                <div className="card-header">
                  <span className="card-icon">📈</span>
                  <span>AI Insight</span>
                </div>
                <div className="insight-text">
                  You're spending 15% more on dining this month. Consider meal planning.
                </div>
                <div className="trend-up">+15% ↗</div>
              </div>
              <div className="card-3">
                <div className="card-header">
                  <span className="card-icon">🎯</span>
                  <span>Savings Goal</span>
                </div>
                <div className="goal-progress">
                  <div className="goal-circle">
                    <span>65%</span>
                  </div>
                  <span>Vacation Fund: ₹65k/₹100k</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="features-section">
          <div className="section-header">
            <h2>Everything You Need for Smart Finance</h2>
            <p>Advanced tools designed for modern financial management</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-link">
                  <span>Learn more</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TESTIMONIALS CAROUSEL ================= */}
        <section className="testimonials-section">
          <div className="section-header">
            <h2>Trusted by Professionals</h2>
            <p>See what our users have to say</p>
          </div>
          <div className="carousel-container">
            <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="testimonial-card">
                    <div className="testimonial-avatar">{testimonial.avatar}</div>
                    <div className="testimonial-content">
                      <p className="testimonial-text">"{testimonial.text}"</p>
                      <div className="testimonial-author">
                        <strong>{testimonial.author}</strong>
                        <span>{testimonial.role}</span>
                      </div>
                      <div className="rating">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Transform Your Financial Future?</h2>
            <p>Join thousands of professionals who trust us with their financial management.</p>
            <div className="cta-actions">
              <button className="primary-btn large" onClick={() => setLoginOpen(true)}>
                Get Started for Free
                <span className="btn-icon">🚀</span>
              </button>
              <button className="secondary-btn large">
                Schedule a Demo
                <span className="btn-icon">📅</span>
              </button>
            </div>
            <p className="cta-note">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>FinSmart AI</h3>
              <p>Smart Spending. AI Insights. Better Decisions.</p>
              <div className="social-links">
                <span>🐦</span>
                <span>📘</span>
                <span>💼</span>
                <span>📸</span>
              </div>
            </div>
            <div className="footer-links">
              <div>
                <h4>Product</h4>
                <a>Features</a>
                <a>Pricing</a>
                <a>API</a>
                <a>Documentation</a>
              </div>
              <div>
                <h4>Company</h4>
                <a>About</a>
                <a>Blog</a>
                <a>Careers</a>
                <a>Contact</a>
              </div>
              <div>
                <h4>Legal</h4>
                <a>Privacy</a>
                <a>Terms</a>
                <a>Security</a>
                <a>Cookies</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 FinSmart AI. All rights reserved.</p>
            <div className="store-buttons">
              <div className="store-btn">
                <span className="store-icon">📱</span>
                <div>
                  <small>Download on the</small>
                  <span>App Store</span>
                </div>
              </div>
              <div className="store-btn">
                <span className="store-icon">▶</span>
                <div>
                  <small>Get it on</small>
                  <span>Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Landing;