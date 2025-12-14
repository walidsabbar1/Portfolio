// Contact.js
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPaperPlane, FaMapMarkerAlt, FaCheck, FaTimes, FaPhone } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import InteractiveBackground from './InteractiveBackground';

function Contact() {
  // Add initial loading state simulation
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    // Simulate initial page load
    setTimeout(() => {
      setLoading(false);
      document.body.classList.add('page-loaded'); 
    }, 800);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    setSuccess(false);

    // Formspree endpoint
    const formspreeEndpoint = 'https://formspree.io/f/mwpjoeqr';

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Portfolio Contact - ${formData.name}`,
          _replyto: formData.email,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError(true);
      setTimeout(() => setError(false), 5000);
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  if (loading) {
     return (
       <div className="detail contact-page-wrapper">
         <InteractiveBackground />
         <div className="page-content-container">
           <div className="skeleton skeleton-title" style={{width: '300px', height: '3rem', margin: '0 auto 3rem'}}></div>
           
           <div className="contact-grid">
             <div className="contact-left">
               <div className="skeleton skeleton-text" style={{width: '200px', height: '2rem', marginBottom: '1.5rem'}}></div>
               <div className="contact-cards-container">
                 <div className="skeleton skeleton-floating-card"></div>
                 <div className="skeleton skeleton-floating-card"></div>
                 <div className="skeleton skeleton-floating-card"></div>
               </div>
             </div>
             
             <div className="contact-right">
               <div className="skeleton skeleton-glass-form"></div>
             </div>
           </div>
         </div>
       </div>
     );
  }

  return (
    <div className="contact-page-wrapper">
      <InteractiveBackground />
      
      <div className="page-content-container">
        <div className="contact-grid">
          {/* Left Side: Contact Cards & Info */}
          <div className="contact-left">
            <h2 className="section-subtitle animate-fade-in" style={{animationDelay: '0.1s'}}>{t.letsConnect}</h2>
            
            <div className="contact-cards-container">
              <a href="mailto:wsabbar20@gmail.com" className="floating-contact-card animate-card" style={{animationDelay: '0.2s'}}>
                <div className="card-icon-wrapper mail">
                  <FaEnvelope />
                </div>
                <div className="card-info">
                  <span className="card-label">Email</span>
                  <span className="card-value">wsabbar20@gmail.com</span>
                </div>
                <div className="card-bg-glow"></div>
              </a>

              <a href="tel:+212649756160" className="floating-contact-card animate-card" style={{animationDelay: '0.3s'}}>
                <div className="card-icon-wrapper phone">
                  <FaPhone />
                </div>
                <div className="card-info">
                  <span className="card-label">{t.phone || 'Phone'}</span>
                  <span className="card-value">+212 649-756160</span>
                </div>
                 <div className="card-bg-glow"></div>
              </a>

              <div className="floating-contact-card animate-card" style={{animationDelay: '0.4s'}}>
                <div className="card-icon-wrapper location">
                  <FaMapMarkerAlt />
                </div>
                <div className="card-info">
                  <span className="card-label">{t.location}</span>
                  <span className="card-value">Maroc</span>
                </div>
                 <div className="card-bg-glow"></div>
              </div>
            </div>

            <div className="availability-status animate-fade-in" style={{animationDelay: '0.5s'}}>
              <div className="status-dot pulsing"></div>
              <p>{t.within24Hours}</p>
            </div>
          </div>

          {/* Right Side: Interactive Form */}
          <div className="contact-right animate-card" style={{animationDelay: '0.4s'}}>
            <div className="glass-form-container">
              <form onSubmit={handleSubmit} className="interactive-form">
                <div className={`form-group-floating ${activeField === 'name' || formData.name ? 'active' : ''}`}>
                  <div className="input-icon"><FaUser /></div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    required
                    disabled={sending || success}
                  />
                  <label htmlFor="name">{t.yourName}</label>
                  <div className="input-highlight"></div>
                </div>
                
                <div className={`form-group-floating ${activeField === 'email' || formData.email ? 'active' : ''}`}>
                  <div className="input-icon"><FaEnvelope /></div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    required
                    disabled={sending || success}
                  />
                  <label htmlFor="email">{t.yourEmail}</label>
                  <div className="input-highlight"></div>
                </div>
                
                <div className={`form-group-floating textarea-group ${activeField === 'message' || formData.message ? 'active' : ''}`}>
                  <div className="input-icon top-align"><FaEnvelope /></div>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    required
                    disabled={sending || success}
                  />
                  <label htmlFor="message">{t.yourMessage}</label>
                  <div className="input-highlight"></div>
                </div>
                
                <button 
                  type="submit" 
                  className={`submit-btn-premium ${sending ? 'loading' : ''} ${success ? 'success' : ''} ${error ? 'error' : ''}`}
                  disabled={sending || success}
                >
                  <span className="btn-content">
                    {sending ? (
                       <div className="spinner-small"></div>
                    ) : success ? (
                      <>
                        <FaCheck /> <span>{t.sentSuccessfully}</span>
                      </>
                    ) : error ? (
                      <>
                        <FaTimes /> <span>{t.failedTryAgain}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.sendMessage}</span> <FaPaperPlane className="plane-icon"/>
                      </>
                    )}
                  </span>
                  <div className="btn-glow"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;