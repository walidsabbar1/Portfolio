// Home.js
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

import pfp from '../Assets/images/pfpwebp.webp';
import InteractiveBackground from './InteractiveBackground';

function Home({ supabase }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [profile, setProfile] = useState(null);
  
  // Typewriter effect state
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const cardRef = useRef(null);

  // Typewriter effect logic
  useEffect(() => {
    const roles = [t.tagline, "Full Stack Developer", "UI/UX Designer", "Problem Solver"];
    const i = loopNum % roles.length;
    const fullText = roles[i];

    const handleTyping = () => {
      setDisplayText(isDeleting 
        ? fullText.substring(0, displayText.length - 1) 
        : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, t.tagline]);

  useEffect(() => {
    document.body.classList.add('page-loaded');
    
    // Fetch dynamic profile data
    const fetchProfile = async () => {
      if (!supabase) return;
      try {
        const { data } = await supabase.from('profile_info').select('*').limit(1).single();
        if (data) setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [supabase]);

  return (
    <div className="detail home-animate">
      <InteractiveBackground />
      
      {/* Added page-content-container wrapper */}
      <div className="page-content-container">
        <div className="home-container">
          {/* Left Side - Text Content */}
          <div className="home-content">
            <div className="intro-badge animate-slide-up">
              <span className="wave">👋</span> {t.welcome}
            </div>
            
            <h1 className="home-title animate-slide-up" style={{animationDelay: '0.1s'}}>
              <span className="text-light">I'm</span> <span className="name-glitch" data-text={profile?.full_name}>{profile?.full_name}</span>
            </h1>
            
            <div className="typewriter-container animate-slide-up" style={{animationDelay: '0.2s'}}>
              <span className="typewriter-text">{displayText}</span>
              <span className="cursor">|</span>
            </div>
            
            <p className="home-description animate-slide-up" style={{animationDelay: '0.3s'}}>
              {profile?.hero_text}
            </p>
            
            <div className="home-actions animate-slide-up" style={{animationDelay: '0.4s'}}>
              <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="primary-btn">
                {t.letsConnect} <i className='bx bx-right-arrow-alt'></i>
              </a>
            </div>
            
            <div className="social-links-minimal animate-fade-in" style={{animationDelay: '0.6s'}}>
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className='bx bxl-linkedin'></i>
                </a>
              )}
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <i className='bx bxl-github'></i>
                </a>
              )}
              <a href="https://www.instagram.com/walid_sabbar1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className='bx bxl-instagram'></i>
              </a>
              <a href="https://www.youtube.com/channel/UCVnf6C2Qn1nrAYKlFgIbhiw" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className='bx bxl-youtube'></i>
              </a>
            </div>
          </div>
          
          {/* Right Side - 3D Image */}
          <div className="home-image-section animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div 
              className="profile-card-3d"
              ref={cardRef}
            >
              <div className="card-content">
                <div className="image-wrapper">
                  <img src={pfp} alt="Walid Sabbar" />
                  <div className="image-overlay"></div>
                </div>
                <div className="card-decoration"></div>
                
                {/* Floating tech icons */}
                <div className="floating-icon react"><i className='bx bxl-react'></i></div>
                <div className="floating-icon js"><i className='bx bxl-javascript'></i></div>
                <div className="floating-icon node"><i className='bx bxl-nodejs'></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;