// About.js
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import InteractiveBackground from './InteractiveBackground';
import pfp from '../Assets/images/pfpwebp.webp';

function About({ supabase, user }) {
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bio');
  const [profile, setProfile] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
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

    const fetchDynamicData = async () => {
      try {
        const [profileRes, eduRes, expRes] = await Promise.all([
          supabase.from('profile_info').select('*').limit(1).single(),
          supabase.from('education').select('*'),
          supabase.from('experience').select('*')
        ]);
        
        if (profileRes.data) setProfile(profileRes.data);

        // Helper to extract year for reliable chronological sorting
        const extractYear = (dateStr) => {
          if (!dateStr) return 0;
          const lower = String(dateStr).toLowerCase();
          if (lower.includes('present') || lower.includes('current') || lower.includes('en cours')) return 9999;
          const match = lower.match(/\d{4}/);
          return match ? parseInt(match[0], 10) : 0;
        };

        if (eduRes.data) {
          const sortedEdu = eduRes.data.sort((a, b) => {
            const yearA = extractYear(a.end_year) || extractYear(a.start_year);
            const yearB = extractYear(b.end_year) || extractYear(b.start_year);
            return yearB - yearA; // Descending (recent first)
          });
          setEducationList(sortedEdu);
        }
        
        if (expRes.data) {
          const sortedExp = expRes.data.sort((a, b) => {
            const yearA = extractYear(a.end_date) || extractYear(a.start_date);
            const yearB = extractYear(b.end_date) || extractYear(b.start_date);
            return yearB - yearA; // Descending (recent first)
          });
          setExperienceList(sortedExp);
        }
      } catch (error) {
        console.error('Error fetching dynamic data:', error);
      }
    };

    // Simulate loading for better UX demonstration
    setTimeout(() => {
      trackVisit();
      fetchDynamicData();
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
              {profile?.bio && profile.bio.split('\n').map((line, i) => (
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
              {educationList.length > 0 && educationList.map((edu) => (
                <div key={edu.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-date">{edu.start_year} - {edu.end_year}</span>
                    <h4 className="timeline-title">{edu.degree}</h4>
                    <p className="timeline-subtitle">{edu.school}</p>
                    <p className="timeline-desc">{edu.description}</p>
                  </div>
                </div>
              ))}
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
              {experienceList.length > 0 && experienceList.map(exp => (
                <div key={exp.id} className="experience-card">
                  <div className="exp-header">
                    <h4 className="exp-title">{exp.job_title}</h4>
                    <span className="exp-company">{exp.company}</span>
                    <span className="exp-date">{exp.start_date} - {exp.end_date}</span>
                  </div>
                  <p className="exp-desc">{exp.description}</p>
                </div>
              ))}
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
              <h2 className="profile-name">{profile?.full_name}</h2>
              <p className="profile-role">{profile?.title}</p>
              
              <div className="profile-actions">
                {profile?.resume_url && (
                  <a 
                    href={profile.resume_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-btn primary"
                    style={{
                      textDecoration: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}
                  >
                    <i className='bx bx-file-blank'></i> {t.downloadCv || "View CV"}
                  </a>
                )}
              </div>

              <div className="profile-social">
                {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub"><i className='bx bxl-github'></i></a>}
                {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><i className='bx bxl-linkedin'></i></a>}
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