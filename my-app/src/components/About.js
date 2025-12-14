// About.js
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import InteractiveBackground from './InteractiveBackground';
import pfp from '../Assets/images/pfpwebp.webp';
import cv from '../Assets/Walid_Sabbar_cv.pdf';

function About({ supabase, user }) {
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bio');
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const { error } = await supabase
          .from('page_visits')
          .insert([
            {
              page_name: 'about',
              user_id: user?.id || null,
              visited_at: new Date().toISOString()
            }
          ]);

        if (error) throw error;

        const { count, error: countError } = await supabase
          .from('page_visits')
          .select('*', { count: 'exact', head: true })
          .eq('page_name', 'about');

        if (countError) throw countError;

        setVisitCount(count || 0);
      } catch (error) {
        console.error('Error tracking visit:', error.message);
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading for better UX demonstration
    setTimeout(() => {
      trackVisit();
    }, 800);
    
    document.body.classList.add('page-loaded');
  }, [supabase, user]);

  if (loading) {
    return (
      <div className="detail" style={{ marginTop: 0 }}>
        <InteractiveBackground />
        
        <div className="page-content-container">
          <div className="about-dashboard">
            {/* Left Panel: Profile Skeleton */}
            <div className="profile-panel">
              <div className="profile-card">
                <div className="profile-image-container">
                  <div className="skeleton skeleton-circle-large" style={{width: '200px', height: '200px', margin: '0 auto'}}></div>
                </div>
                <div className="skeleton skeleton-title" style={{width: '70%', height: '2rem', margin: '1rem auto 0.5rem'}}></div>
                <div className="skeleton skeleton-text" style={{width: '50%', height: '1rem', margin: '0 auto 2rem'}}></div>
                
                <div className="profile-actions" style={{marginBottom: '2rem'}}>
                  <div className="skeleton skeleton-button" style={{width: '100%', height: '3rem', borderRadius: '50px'}}></div>
                </div>

                <div className="profile-social" style={{justifyContent: 'center', gap: '1rem'}}>
                  <div className="skeleton skeleton-circle-small" style={{width: '40px', height: '40px'}}></div>
                  <div className="skeleton skeleton-circle-small" style={{width: '40px', height: '40px'}}></div>
                </div>
              </div>
            </div>

            {/* Right Panel: Content Skeleton */}
            <div className="content-panel">
              <div className="dashboard-tabs" style={{marginBottom: '2rem'}}>
                <div className="skeleton skeleton-button" style={{width: '120px', height: '40px'}}></div>
                <div className="skeleton skeleton-button" style={{width: '120px', height: '40px'}}></div>
                <div className="skeleton skeleton-button" style={{width: '120px', height: '40px'}}></div>
              </div>

              <div className="dashboard-content">
                <div className="about-content-section">
                    <div className="skeleton skeleton-title" style={{width: '150px', height: '2rem', marginBottom: '1.5rem'}}></div>
                    <div className="skeleton skeleton-text" style={{width: '100%', marginBottom: '0.5rem'}}></div>
                    <div className="skeleton skeleton-text" style={{width: '95%', marginBottom: '0.5rem'}}></div>
                    <div className="skeleton skeleton-text" style={{width: '90%', marginBottom: '0.5rem'}}></div>
                    <div className="skeleton skeleton-text" style={{width: '85%', marginBottom: '2rem'}}></div>
                    
                    <div className="stats-grid">
                        <div className="skeleton skeleton-card" style={{height: '100px'}}></div>
                        <div className="skeleton skeleton-card" style={{height: '100px'}}></div>
                        <div className="skeleton skeleton-card" style={{height: '100px'}}></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'bio':
        return (
          <div className="about-content-section animate-fade-in">
            <h3 className="section-title">
              <span className="hash">#</span> {t.whoIAm}
            </h3>
            <div className="bio-text">
              {t.whoIAmText.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">2+</span>
                <span className="stat-label">{t.level?.advanced ? 'Years Exp.' : 'Années Exp.'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">{t.projectsTitle}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{visitCount}</span>
                <span className="stat-label">Profile Views</span>
              </div>
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="about-content-section animate-fade-in">
            <h3 className="section-title">
              <span className="hash">#</span> {t.education}
            </h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">{t.educationItems.fullstack.period}</span>
                  <h4 className="timeline-title">{t.educationItems.fullstack.title}</h4>
                  <p className="timeline-subtitle">OFPPT Casablanca</p>
                  <p className="timeline-desc">{t.educationItems.fullstack.description}</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2021 - 2024</span>
                  <h4 className="timeline-title">{t.educationItems.license.title}</h4>
                  <p className="timeline-subtitle">{t.educationItems.license.period}</p>
                  <p className="timeline-desc">{t.educationItems.license.description}</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">{t.educationItems.bac.period}</span>
                  <h4 className="timeline-title">{t.educationItems.bac.title}</h4>
                  <p className="timeline-subtitle">Lycée Othman Ibn Affane</p>
                  <p className="timeline-desc">{t.educationItems.bac.description}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="about-content-section animate-fade-in">
            <h3 className="section-title">
              <span className="hash">#</span> {t.experience}
            </h3>
            <div className="experience-list">
              <div className="experience-card">
                <div className="exp-header">
                  <h4 className="exp-title">{t.experienceItems.sothema.title}</h4>
                  <span className="exp-company">SOTHEMA</span>
                  <span className="exp-date">{t.experienceItems.sothema.period}</span>
                </div>
                <p className="exp-desc">{t.experienceItems.sothema.description}</p>
                <div className="exp-tech">
                  <span>React</span>
                  <span>Laravel</span>
                  <span>MySQL</span>
                </div>
              </div>
              <div className="experience-card">
                <div className="exp-header">
                  <h4 className="exp-title">{t.experienceItems.hackathon.title}</h4>
                  <span className="exp-company">ISGI Hackathon</span>
                  <span className="exp-date">{t.experienceItems.hackathon.period}</span>
                </div>
                <p className="exp-desc">{t.experienceItems.hackathon.description}</p>
                <div className="exp-tech">
                  <span>Teamwork</span>
                  <span>Innovation</span>
                  <span>Prototyping</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="detail" style={{ marginTop: 0 }}>
      <InteractiveBackground />
      
      {/* Added page-content-container wrapper */}
      <div className="page-content-container">
        <div className="about-dashboard">
          {/* Left Panel: Profile */}
          <div className="profile-panel">
            <div className="profile-card">
              <div className="profile-image-container">
                <div className="profile-image-placeholder">
                  <img src={pfp} alt="Walid Sabbar" className="profile-image" />
                </div>
                <div className="status-badge">
                  <span className="status-dot"></span>
                  Available
                </div>
              </div>
              <h2 className="profile-name">Walid Sabbar</h2>
              <p className="profile-role">Full Stack Developer</p>
              
              <div className="profile-actions">
                <a 
                  href={cv} 
                  download="Walid_Sabbar_CV.pdf"
                  className="cv-btn primary"
                  style={{
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}
                >
                  <i className='bx bx-download'></i> {t.downloadCv}
                </a>
              </div>

              <div className="profile-social">
                <a href="https://github.com/walidsabbar1" className="social-link" aria-label="GitHub"><i className='bx bxl-github'></i></a>
                <a href="https://www.linkedin.com/in/walid-sabbar-5262152a0/" className="social-link" aria-label="LinkedIn"><i className='bx bxl-linkedin'></i></a>
              </div>
            </div>
          </div>

          {/* Right Panel: Content */}
          <div className="content-panel">
            <div className="dashboard-tabs">
              <button 
                className={`tab-btn ${activeTab === 'bio' ? 'active' : ''}`}
                onClick={() => setActiveTab('bio')}
              >
                <i className='bx bx-user'></i> {t.whoIAm}
              </button>
              <button 
                className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                <i className='bx bx-book'></i> {t.education}
              </button>
              <button 
                className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                <i className='bx bx-briefcase'></i> {t.experience}
              </button>
            </div>

            <div className="dashboard-content">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;