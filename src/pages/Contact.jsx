import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    cname: '',
    cemail: '',
    csubject: '',
    cmessage: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name: formData.cname,
      email: formData.cemail,
      subject: formData.csubject,
      message: formData.cmessage
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit message.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setError('Network error. Please make sure server is running.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="genz-floating-orb" style={{ top: '-40px', right: '10%' }}></div>
        <div className="genz-floating-orb" style={{ bottom: '-60px', left: '5%', animationDelay: '-3s' }}></div>
        <div className="page-hero-bg"></div>
        <div className="page-hero-inner">
          <div className="page-hero-content animate-in">
            <div className="section-tag" style={{ letterSpacing: '2px' }}>⚡ GET IN TOUCH</div>
            <h1 className="page-title">Let's Start a<br /><span className="gold">Conversation.</span></h1>
            <p className="page-desc">Have a question or idea? We'd love to hear from you.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section">
        <div className="contact-inner">
          {/* Info Cards */}
          <div className="contact-info animate-in" style={{ animationDelay: '0.15s' }}>
            <div className="contact-info-card contact-card-genz">
              <h3>Get In Touch</h3>
              <div className="contact-detail">
                <div className="contact-icon" style={{ transition: 'transform 0.3s ease' }}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>
                <div className="contact-detail-text">
                  <strong>Visit Us</strong>
                  <span>Karnavati University, Uvarsad, Gandhinagar, Gujarat 382422</span>
                </div>
              </div>
              <div className="contact-detail">
                <div className="contact-icon" style={{ transition: 'transform 0.3s ease' }}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div>
                <div className="contact-detail-text">
                  <strong>Email Us</strong>
                  <span style={{ wordBreak: 'break-all' }}>uitstudentscommittee@karnavatiuniversity.edu.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrap contact-card-genz animate-in" style={{ animationDelay: '0.3s' }}>
            <h2>Send Us a Message</h2>
            {!submitted ? (
              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="cname">Full Name *</label>
                    <input type="text" id="cname" value={formData.cname} onChange={handleChange} placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cemail">Email Address *</label>
                    <input type="email" id="cemail" value={formData.cemail} onChange={handleChange} placeholder="your@email.com" required />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="csubject">Subject *</label>
                    <select id="csubject" value={formData.csubject} onChange={handleChange} required>
                      <option value="" disabled>What's this about?</option>
                      <option>General Inquiry</option>
                      <option>Event Collaboration</option>
                      <option>Sponsorship / Partnership</option>
                      <option>Media & Press</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group full">
                    <label htmlFor="cmessage">Message *</label>
                    <textarea id="cmessage" value={formData.cmessage} onChange={handleChange} placeholder="Write your message here..." style={{ minHeight: '160px' }} required></textarea>
                  </div>
                </div>

                {error && (
                  <div style={{ marginTop: '12px', padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '6px', fontSize: '13px' }}>
                    ⚠️ {error}
                  </div>
                )}

                <div style={{ marginTop: '24px' }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                    {loading ? 'Sending...' : 'Send Message'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" style={{ transition: 'transform 0.3s ease' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </form>
            ) : (
              <div id="contactSuccess" className="success-pop" style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px', display: 'inline-block' }}>✨</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '24px', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px' }}>Message sent !</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-mid)', fontWeight: 500 }}>We'll get back to you</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
