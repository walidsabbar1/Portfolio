// App.js
import { useState, useCallback, lazy, Suspense, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { translations } from './utils/translations';
import './App.css';
import pfp from './Assets/images/pfpwebp.webp';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ManageProjects from './components/admin/ManageProjects';
import ManageSkills from './components/admin/ManageSkills';
import ManageExperience from './components/admin/ManageExperience';
import ManageEducation from './components/admin/ManageEducation';
import ManageProfile from './components/admin/ManageProfile';

// Lazy load components for code splitting
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));

// Navigation configuration
const navLinks = [
  { path: '/', label: 'home' },
  { path: '/about', label: 'about' },
  { path: '/skills', label: 'skills' },
  { path: '/projects', label: 'projects' },
  { path: '/contact', label: 'contact' },
];

// Routes configuration
const routes = [
  { path: '/', Component: Home, showProfile: false, isHome: true },
  { path: '/about', Component: About, showProfile: false },
  { path: '/skills', Component: Skills, showProfile: false },
  { path: '/projects', Component: Projects, showProfile: false },
  { path: '/contact', Component: Contact, showProfile: false },
];

// Reusable NavLink component
const NavigationLink = ({ to, children, onNavigate }) => (
  <NavLink
    to={to}
    className={({ isActive }) => (isActive ? 'active' : '')}
    onClick={onNavigate}
  >
    {children}
  </NavLink>
);

// Page Wrapper Component
const PageWrapper = ({ children, showProfile = false, isHome = false }) => (
  <div className="container">
    <div className={`main ${isHome ? 'home-page' : ''}`}>
      {children}
      {showProfile && (
        <div className="images fixed-image">
          <img src={pfp} alt="Walid Sabbar - Web Developer" className="img-w" />
        </div>
      )}
    </div>
  </div>
);

// LinkedIn-style Skeleton Loading Components
const SkeletonHome = () => (
  <PageWrapper showProfile={false}>
    <div className="detail home-animate">
      <div className="home-container">
        {/* Left Side - Text Content Skeleton */}
        <div className="home-content">
          {/* Intro Badge Skeleton */}
          <div className="skeleton" style={{ 
            width: '140px', 
            height: '2.2rem', 
            borderRadius: '50px', 
            marginBottom: '1rem' 
          }}></div>
          
          {/* Title Skeleton */}
          <div className="skeleton" style={{ 
            width: '80%', 
            height: '4rem', 
            marginBottom: '1rem' 
          }}></div>
          
          {/* Typewriter Skeleton */}
          <div className="skeleton" style={{ 
            width: '60%', 
            height: '2rem', 
            marginBottom: '1.5rem' 
          }}></div>
          
          {/* Description Skeleton */}
          <div className="skeleton" style={{ 
            width: '100%', 
            height: '1.1rem', 
            marginBottom: '0.5rem' 
          }}></div>
          <div className="skeleton" style={{ 
            width: '90%', 
            height: '1.1rem', 
            marginBottom: '2rem' 
          }}></div>
          
          {/* Actions Skeleton */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="skeleton" style={{ 
              width: '160px', 
              height: '3.5rem', 
              borderRadius: '50px' 
            }}></div>
            <div className="skeleton" style={{ 
              width: '160px', 
              height: '3.5rem', 
              borderRadius: '50px' 
            }}></div>
          </div>
          
          {/* Social Links Skeleton */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="skeleton" style={{ 
                 width: '2rem', 
                 height: '2rem', 
                 borderRadius: '50%' 
               }}></div>
             ))}
          </div>
        </div>
        
        {/* Right Side - Image Skeleton */}
        <div className="home-image-section">
           <div className="skeleton" style={{ 
             width: '320px', 
             height: '420px', 
             borderRadius: '24px' 
           }}></div>
        </div>
      </div>
    </div>
  </PageWrapper>
);

const SkeletonAbout = () => (
  <PageWrapper>
    <div className="detail">
      <div className="skeleton skeleton-title" style={{width: '200px', height: '2.5rem', marginBottom: '1rem'}}></div>
      <div className="skeleton skeleton-tagline" style={{width: '300px', height: '1.5rem', marginBottom: '2rem'}}></div>
      
      <div className="about-cards">
        {/* Who I Am Card Skeleton */}
        <div className="about-card">
          <div className="skeleton skeleton-icon" style={{width: '3.5rem', height: '3.5rem', borderRadius: '10px', marginBottom: '1.25rem'}}></div>
          <div className="skeleton skeleton-text" style={{width: '60%', height: '1.75rem', marginBottom: '1rem'}}></div>
          <div className="skeleton skeleton-text" style={{marginBottom: '0.75rem'}}></div>
          <div className="skeleton skeleton-text" style={{width: '95%', marginBottom: '0.75rem'}}></div>
          <div className="skeleton skeleton-text" style={{width: '90%', marginBottom: '0.75rem'}}></div>
          <div className="skeleton skeleton-text" style={{width: '85%'}}></div>
        </div>

        {/* Education Card Skeleton */}
        <div className="about-card">
          <div className="skeleton skeleton-icon" style={{width: '3.5rem', height: '3.5rem', borderRadius: '10px', marginBottom: '1.25rem'}}></div>
          <div className="skeleton skeleton-text" style={{width: '50%', height: '1.75rem', marginBottom: '1.5rem'}}></div>
          
          <div className="about-card-content">
            {[1, 2, 3].map(i => (
              <div key={i} className="education-item" style={{marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(26, 29, 33, 0.1)'}}>
                <div className="skeleton skeleton-text" style={{width: '70%', height: '1.25rem', marginBottom: '0.5rem'}}></div>
                <div className="skeleton skeleton-text-sm" style={{width: '40%', height: '1rem', marginBottom: '0.75rem'}}></div>
                <div className="skeleton skeleton-text" style={{marginBottom: '0.5rem', width: '95%'}}></div>
                <div className="skeleton skeleton-text" style={{width: '90%'}}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Card Skeleton */}
        <div className="about-card">
          <div className="skeleton skeleton-icon" style={{width: '3.5rem', height: '3.5rem', borderRadius: '10px', marginBottom: '1.25rem'}}></div>
          <div className="skeleton skeleton-text" style={{width: '60%', height: '1.75rem', marginBottom: '1.5rem'}}></div>
          
          <div className="about-card-content">
            {[1, 2].map(i => (
              <div key={i} className="experience-item" style={{marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(26, 29, 33, 0.1)'}}>
                <div className="skeleton skeleton-text" style={{width: '80%', height: '1.25rem', marginBottom: '0.5rem'}}></div>
                <div className="skeleton skeleton-text-sm" style={{width: '35%', height: '1rem', marginBottom: '0.75rem'}}></div>
                <div className="skeleton skeleton-text" style={{marginBottom: '0.5rem', width: '95%'}}></div>
                <div className="skeleton skeleton-text" style={{width: '85%'}}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
);

const SkeletonSkills = () => (
  <PageWrapper>
    <div className="detail" style={{ marginTop: 0 }}>
      <div className="skeleton skeleton-title" style={{width: '150px', height: '2.5rem', marginBottom: '1rem'}}></div>
      <div className="skeleton skeleton-tagline" style={{width: '250px', height: '1.5rem', marginBottom: '2rem'}}></div>
      
      <div className="skills-layout-container">
        {/* Lottie Animation Skeleton - Left Side */}
        <div className="skills-animation-left">
          <div className="skeleton" style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            minHeight: '500px'
          }}></div>
        </div>

        {/* Skills Content Skeleton - Right Side */}
        <div className="skills-content-right">
          <div className="skills-minimal">
            {[1, 2, 3, 4].map((category, categoryIndex) => (
              <div key={category} className="skill-category" style={{marginBottom: '3rem'}}>
                <div className="skeleton skeleton-text" style={{
                  width: '40%',
                  height: '1.5rem',
                  marginBottom: '1.5rem'
                }}></div>
                
                <div className="skills-grid">
                  {[1, 2, 3].map((skill, skillIndex) => {
                    const animationDelay = `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s`;
                    
                    return (
                      <div 
                        key={skill}
                        className="skill-card skeleton-pulse"
                        style={{ animationDelay }}
                      >
                        <div className="skill-header">
                          <div className="skeleton skeleton-circle-small" style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px'
                          }}></div>
                          <div className="skill-info" style={{flex: 1}}>
                            <div className="skeleton skeleton-text" style={{
                              width: '60%',
                              height: '1.1rem',
                              marginBottom: '0.25rem'
                            }}></div>
                            <div className="skeleton skeleton-text-sm" style={{
                              width: '40%',
                              height: '0.85rem'
                            }}></div>
                          </div>
                        </div>
                        
                        <div className="skill-progress">
                          <div className="progress-bar">
                            <div className="skeleton skeleton-progress" style={{
                              width: `${Math.random() * 60 + 40}%`,
                              height: '6px',
                              borderRadius: '3px'
                            }}></div>
                          </div>
                          <div className="skeleton skeleton-text-sm" style={{
                            width: '40px',
                            height: '0.8rem'
                          }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
);

const SkeletonProjects = () => (
  <PageWrapper>
    <div className="detail" style={{ marginTop: 0 }}>
      <div className="skeleton skeleton-title" style={{width: '200px', height: '2.5rem', marginBottom: '1rem'}}></div>
      <div className="skeleton skeleton-tagline" style={{width: '300px', height: '1.5rem', marginBottom: '2rem'}}></div>
      
      <div className="projects-terminal-container">
        <div className="projects-terminal">
          {/* Left Panel - Project List Skeleton */}
          <div className="projects-list-panel">
            <div className="panel-header">
              <div className="panel-dots">
                <span className='dot1'></span>
                <span className='dot2'></span>
                <span className='dot3'></span>
              </div>
              <span className="panel-title">PROJECTS LIST</span>
            </div>
            <div className="projects-list">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="project-list-item skeleton-pulse">
                  <div className="project-list-indicator">
                    <div className="skeleton skeleton-circle-small" style={{width: '12px', height: '12px'}}></div>
                  </div>
                  <div className="project-list-content">
                    <div className="skeleton skeleton-text" style={{width: '70%', height: '1.2rem', marginBottom: '0.5rem'}}></div>
                    <div className="project-list-tech">
                      <div className="skeleton skeleton-text-sm" style={{width: '50px', height: '20px', borderRadius: '12px'}}></div>
                      <div className="skeleton skeleton-text-sm" style={{width: '40px', height: '20px', borderRadius: '12px'}}></div>
                      <div className="skeleton skeleton-text-sm" style={{width: '30px', height: '20px', borderRadius: '12px'}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Cables Skeleton */}
          <div className="terminal-cables">
            <div className="cable cable-1 skeleton-pulse"></div>
            <div className="cable cable-2 skeleton-pulse"></div>
            <div className="cable cable-3 skeleton-pulse"></div>
          </div>

          {/* Right Panel - Project Details Skeleton */}
          <div className="project-details-panel">
            <div className="panel-header">
              <div className="panel-dots">
                <span className='dot1'></span>
                <span className='dot2'></span>
                <span className='dot3'></span>
              </div>
              <span className="panel-title">
                <div className="skeleton skeleton-text" style={{width: '150px', height: '1rem', display: 'inline-block'}}></div>
              </span>
            </div>
            
            <div className="project-details-content">
              {/* Project Description Skeleton */}
              <div className="project-description">
                <div className="skeleton skeleton-text" style={{marginBottom: '0.75rem'}}></div>
                <div className="skeleton skeleton-text" style={{width: '95%', marginBottom: '0.75rem'}}></div>
                <div className="skeleton skeleton-text" style={{width: '90%', marginBottom: '0.75rem'}}></div>
                <div className="skeleton skeleton-text" style={{width: '85%'}}></div>
              </div>
              
              {/* Tech Stack Skeleton */}
              <div className="project-tech-stack">
                <div className="skeleton skeleton-text" style={{width: '120px', height: '1.2rem', marginBottom: '1rem'}}></div>
                <div className="tech-tags-grid">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="skeleton skeleton-text" style={{
                      width: `${Math.random() * 40 + 60}px`,
                      height: '36px',
                      borderRadius: '20px'
                    }}></div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons Skeleton */}
              <div className="project-actions">
                <div className="skeleton skeleton-button" style={{width: '140px', height: '44px', borderRadius: '8px'}}></div>
                <div className="skeleton skeleton-button" style={{width: '160px', height: '44px', borderRadius: '8px'}}></div>
              </div>
              
              {/* Navigation Hint Skeleton */}
              <div className="navigation-hint">
                <div className="skeleton skeleton-text-sm" style={{width: '250px', height: '0.9rem', margin: '0 auto'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
);

const SkeletonContact = () => (
  <PageWrapper>
    <div className="detail">
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
          
          {/* Animation placeholder skeleton */}
          <div className="contact-animation-container">
            <div className="skeleton" style={{width: '150px', height: '150px', borderRadius: '12px'}}></div>
          </div>
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
  </PageWrapper>
);

// Loading fallback component
const LoadingFallback = ({ route }) => {
  const skeletonComponents = {
    '/': SkeletonHome,
    '/about': SkeletonAbout,
    '/skills': SkeletonSkills,
    '/projects': SkeletonProjects,
    '/contact': SkeletonContact,
  };

  const SkeletonComponent = skeletonComponents[route] || SkeletonAbout;
  
  return <SkeletonComponent />;
};

// Header component
const Header = ({ menuOpen, setMenuOpen, user, onLogout }) => {
  const { language, toggleLanguage, isFrench } = useLanguage();
  const t = translations[language];

  const handleMenuToggle = useCallback((e) => {
    setMenuOpen(e.target.checked);
  }, [setMenuOpen]);

  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  return (
    <header>
      <div className="header-container">
        <div className="page-header">
          <div className="logo">
            <NavLink to="/">
              Walid<span className="logo-light">Sabbar</span><span className="logo-dot">.</span>
            </NavLink>
          </div>
          <input
            type="checkbox"
            id="click"
            checked={menuOpen}
            onChange={handleMenuToggle}
          />
          <label htmlFor="click" className="mainicon" aria-label="Toggle navigation menu">
            <div className="menu">
              <i className="bx bx-menu" aria-hidden="true"></i>
            </div>
          </label>
          <nav>
            <ul className={menuOpen ? 'menu-open' : ''}>
              {navLinks.map(({ path, label }) => (
                <li key={path}>
                  <NavigationLink to={path} onNavigate={handleNavClick}>
                    {t[label]}
                  </NavigationLink>
                </li>
              ))}
              
              {/* Language Toggle */}
              <li className="language-toggle">
                <div 
                  className={`language-switch ${isFrench ? 'fr-active' : 'en-active'}`} 
                  onClick={toggleLanguage}
                  role="button"
                  tabIndex={0}
                  aria-label={isFrench ? "Switch to English" : "Passer en Français"}
                >
                  <div className="switch-slider"></div>
                  <div className="flag-icon en">
                    <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
                      <rect width="1" height="2" fill="#0055A4"/>
                      <rect width="1" height="2" x="1" fill="#FFFFFF"/>
                      <rect width="1" height="2" x="2" fill="#EF4135"/>
                    </svg>
                  </div>
                  <div className="flag-icon fr">
                    <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
                      <clipPath id="t"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath>
                      <path d="M0,0v30h60v-30z" fill="#012169"/>
                      <path d="M0,0l60,30m0-30l-60,30" stroke="#fff" strokeWidth="6"/>
                      <path d="M0,0l60,30m0-30l-60,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                      <path d="M30,0v30m-30-15h60" stroke="#fff" strokeWidth="10"/>
                      <path d="M30,0v30m-30-15h60" stroke="#C8102E" strokeWidth="6"/>
                    </svg>
                  </div>
                </div>
              </li>
              
              {user && (
                <li className="user-info">
                  <span>{t.welcomeUser} {user.email}</span>
                  <button onClick={onLogout} className="logout-btn">
                    {t.logout}
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Public Layout wrapper to isolate the navigation header to client-facing routes only
const PublicLayout = ({ menuOpen, setMenuOpen, user, onLogout }) => (
  <>
    <Header 
      menuOpen={menuOpen} 
      setMenuOpen={setMenuOpen} 
      user={user} 
      onLogout={onLogout} 
    />
    <Outlet />
  </>
);

// Easter Egg Listener Component
const EasterEggListener = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    let keySequence = '';
    const secretCode = 'admin';

    const handleKeyDown = (e) => {
      // Ignore input if user is typing in a form field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      keySequence += e.key.toLowerCase();

      // Log only the last N characters based on secret code length
      if (keySequence.length > secretCode.length) {
        keySequence = keySequence.slice(keySequence.length - secretCode.length);
      }

      if (keySequence === secretCode) {
        navigate('/admin/login');
        keySequence = ''; // Reset after triggering
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
};

// Main App component
function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Check active sessions and subscribe to auth changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Track current path for loading states
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  }, []);

  const routeElements = useMemo(
    () => routes.map(({ path, Component, showProfile, isHome }) => (
      <Route 
        key={path} 
        path={path} 
        element={
          <Suspense fallback={<LoadingFallback route={path} />}>
            <PageWrapper showProfile={showProfile} isHome={isHome}>
              {Component === Contact ? (
                <Component />
              ) : (
                <Component supabase={supabase} user={user} />
              )}
            </PageWrapper>
          </Suspense>
        } 
      />
    )),
    [user]
  );

  if (loading) {
    const isAdminRoute = currentPath.startsWith('/admin');
    return (
      <BrowserRouter>
        {!isAdminRoute && (
          <Header 
            menuOpen={menuOpen} 
            setMenuOpen={setMenuOpen} 
            user={user} 
            onLogout={handleLogout} 
          />
        )}
        {!isAdminRoute ? (
          <LoadingFallback route={currentPath} />
        ) : (
          <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff' }}>
            <h2>Loading...</h2>
          </div>
        )}
      </BrowserRouter>
    );
  }


  return (
    <BrowserRouter>
      <EasterEggListener />
      <Routes>
        {/* Public Routes Wrapped in PublicLayout */}
        <Route element={<PublicLayout menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} onLogout={handleLogout} />}>
          {routeElements}
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<div className="admin-container"><h1 className="admin-header">Admin Dashboard</h1><div className="admin-card"><p style={{ color: '#475569', fontSize: '1.1rem', margin: 0 }}>Welcome to the secure admin panel. Choose an option from the sidebar to manage your portfolio content.</p></div></div>} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="experience" element={<ManageExperience />} />
          <Route path="education" element={<ManageEducation />} />
          <Route path="profile" element={<ManageProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// App wrapper with LanguageProvider
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;