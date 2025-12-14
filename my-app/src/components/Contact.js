// Contact.js
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPaperPlane, FaMapMarkerAlt, FaClock, FaCheck, FaTimes, FaPhone } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import InteractiveBackground from './InteractiveBackground';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [buttonVibrate, setButtonVibrate] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    document.body.classList.add('page-loaded');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);
    setButtonVibrate(false);

    // Formspree endpoint - replace with your actual form ID
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
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError(true);
      setButtonVibrate(true);
      
      // Stop vibration after 1 second
      setTimeout(() => {
        setButtonVibrate(false);
      }, 1000);
      
      // Reset error state after 5 seconds
      setTimeout(() => {
        setError(false);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Get button content based on state
  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <div className="loading-spinner"></div>
          {t.sending}
        </>
      );
    }
    
    if (success) {
      return (
        <>
          <FaCheck className="btn-icon" />
          {t.sentSuccessfully}
        </>
      );
    }
    
    if (error) {
      return (
        <>
          <FaTimes className="btn-icon" />
          {t.failedTryAgain}
        </>
      );
    }
    
    return (
      <>
        <FaPaperPlane className="btn-icon" />
        {t.sendMessage}
      </>
    );
  };

  // Get button class based on state
  const getButtonClass = () => {
    let className = "submit-btn with-icon";
    
    if (success) className += " btn-success";
    if (error) className += " btn-error";
    if (buttonVibrate) className += " vibrate";
    
    return className;
  };

  // Loading state
  if (loading && !success && !error) {
    return (
      <div className="detail">
        <InteractiveBackground />
        <div className="page-content-container">
          <div className="skeleton skeleton-title" style={{width: '200px', height: '2.5rem', marginBottom: '1rem'}}></div>
          <div className="skeleton skeleton-tagline" style={{width: '300px', height: '1.5rem', marginBottom: '2rem'}}></div>
          
          <div className="contact-container">
            {/* Contact Info Skeleton */}
            <div className="contact-info">
              <div className="skeleton skeleton-text" style={{width: '40%', height: '1.75rem', marginBottom: '1.5rem'}}></div>
              
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="contact-item">
                  <div className="skeleton skeleton-circle-small" style={{width: '1.2rem', height: '1.2rem', marginTop: '0.2rem', flexShrink: 0}}></div>
                  <div style={{flex: 1}}>
                    <div className="skeleton skeleton-text" style={{width: '30%', height: '1rem', marginBottom: '0.25rem'}}></div>
                    <div className="skeleton skeleton-text-sm" style={{width: '60%', height: '0.9rem'}}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form Skeleton */}
            <div className="contact-form-wrapper">
              <form className="contact-form">
                {[1, 2, 3].map(i => (
                  <div key={i} className="form-group">
                    {i < 3 ? (
                      <div className="input-with-icon">
                        <div className="skeleton skeleton-circle-small" style={{
                          position: 'absolute', 
                          left: '1rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          width: '1rem', 
                          height: '1rem',
                          zIndex: 1
                        }}></div>
                        <div className="skeleton skeleton-form-input" style={{paddingLeft: '3rem'}}></div>
                      </div>
                    ) : (
                      <div className="skeleton skeleton-form-textarea"></div>
                    )}
                  </div>
                ))}
                
                <div className="skeleton skeleton-form-input" style={{width: '50%', height: '3.5rem'}}></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail">
      <InteractiveBackground />
      
      {/* Added page-content-container wrapper */}
      <div className="page-content-container">
        <h1 className="animate-slide-up">{t.contactTitle}</h1>
        <p className="tagline animate-slide-up">{t.contactTagline}</p>
        
        <div className="contact-container">
          <div className="contact-info animate-card" style={{animationDelay: '0.2s'}}>
            <h3>{t.letsConnect}</h3>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <strong>{t.location}</strong>
                <p>Maroc</p>
              </div>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <strong>Email</strong>
                <a href="mailto:wsabbar20@gmail.com" style={{color: 'inherit', textDecoration: 'none'}}>
                  <p>wsabbar20@gmail.com</p>
                </a>
              </div>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <strong>{t.phone || 'Phone'}</strong>
                <a href="tel:+212600000000" style={{color: 'inherit', textDecoration: 'none'}}>
                  <p>+212 649756160</p>
                </a>
              </div>
            </div>
            <div className="contact-item">
              <FaClock className="contact-icon" />
              <div>
                <strong>{t.responseTime}</strong>
                <p>{t.within24Hours}</p>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper animate-card" style={{animationDelay: '0.3s'}}>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder={t.yourName}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder={t.yourEmail}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder={t.yourMessage}
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading || success}
                />
              </div>
              
              <button 
                type="submit" 
                className={getButtonClass()}
                disabled={loading || success}
              >
                {getButtonContent()}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;