// Projects.js
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { FaExternalLinkAlt, FaCode, FaTerminal } from 'react-icons/fa';
import InteractiveBackground from './InteractiveBackground';

// Typewriter Effect Component
const TypewriterEffect = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current++;
      } else {
        clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, onComplete]);

  return <span>{displayedText}</span>;
};

function Projects({ supabase, user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(0);
  const projectListRef = useRef(null);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulate loading for better UX demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [supabase]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || projects.length === 0) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedProject(prev => (prev + 1) % projects.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedProject(prev => (prev - 1 + projects.length) % projects.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, projects.length]);

  // Auto-scroll selected project into view
  useEffect(() => {
    if (projectListRef.current && projects.length > 0) {
      const selectedElement = projectListRef.current.children[selectedProject];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedProject, projects.length]);

  const handleProjectSelect = (index) => {
    if (index !== selectedProject) {
      setSelectedProject(index);
    }
  };

  if (loading) {
    return (
      <div className="detail" style={{ marginTop: 0 }}>
        <InteractiveBackground />
        <div className="page-content-container">
          <div className="skeleton skeleton-title" style={{width: '200px', height: '2.5rem', marginBottom: '1rem'}}></div>
          
          <div className="projects-terminal-container">
            <div className="skeleton-terminal">
              
              {/* Fake Header */}
              <div className="skeleton-terminal-header">
                <div className="terminal-controls">
                  <div className="control red"></div>
                  <div className="control yellow"></div>
                  <div className="control green"></div>
                </div>
              </div>

              {/* Body */}
              <div className="skeleton-terminal-body">
                <div className="skeleton-terminal-left">
                  {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="skeleton skeleton-text" style={{width: '80%', height: '1.5rem', marginBottom: '1rem', opacity: 1 - (i * 0.15)}}></div>
                  ))}
                </div>
                <div className="skeleton-terminal-right">
                   <div className="skeleton skeleton-text" style={{width: '40%', height: '1.5rem', marginBottom: '1.5rem'}}></div>
                   <div className="skeleton skeleton-text" style={{width: '30%', height: '1rem', marginBottom: '0.5rem'}}></div>
                   <div className="skeleton skeleton-text" style={{width: '90%', height: '1rem', marginBottom: '0.5rem'}}></div>
                   <div className="skeleton skeleton-text" style={{width: '95%', height: '1rem', marginBottom: '0.5rem'}}></div>
                   <div className="skeleton skeleton-text" style={{width: '85%', height: '1rem', marginBottom: '2rem'}}></div>
                   
                   <div className="skeleton skeleton-text" style={{width: '20%', height: '1rem', marginBottom: '0.5rem'}}></div>
                   <div className="skeleton skeleton-text" style={{width: '60%', height: '2.5rem', marginBottom: '1rem', borderRadius: '4px'}}></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentProject = projects[selectedProject];

  return (
    <div className="detail" style={{ marginTop: 0 }}>
      <InteractiveBackground />
      
      {/* Added page-content-container wrapper */}
      <div className="page-content-container">
        
        <div className="projects-terminal-container">
          <div className="projects-terminal">
            {/* CRT Overlay Effects */}
            <div className="crt-overlay"></div>
            <div className="scanline"></div>

            {/* Terminal Header */}
            <div className="terminal-header-bar">
              <div className="terminal-controls">
                <div className="control red"></div>
                <div className="control yellow"></div>
                <div className="control green"></div>
              </div>
              <div className="terminal-title-bar">
                <FaTerminal className="terminal-icon" />
                <span>{t.projectsTagline}</span>
              </div>
              <div className="terminal-status">
                <span className="status-dot"></span>
                LIVE_CONNECTION
              </div>
            </div>

            <div className="terminal-content-wrapper">
              {/* Left Panel - Project List */}
              <div className="projects-list-panel">
                <div className="panel-header-simple">
                  <span>AVAILABLE_MODULES</span>
                  <span className="count">[{projects.length}]</span>
                </div>
                <div className="projects-list" ref={projectListRef}>
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <div
                        key={project.id}
                        className={`project-list-item ${index === selectedProject ? 'selected' : ''}`}
                        onClick={() => handleProjectSelect(index)}
                      >
                        <div className="item-status">
                          {index === selectedProject ? '>' : ' '}
                        </div>
                        <div className="item-content">
                          <span className="item-name">{project.title}</span>
                          <span className="item-meta">
                            {project.technologies?.[0] || 'Unknown'}
                          </span>
                        </div>
                        {index === selectedProject && <div className="blinking-cursor">_</div>}
                      </div>
                    ))
                  ) : (
                    <div className="no-projects-message">
                      {t.noProjects}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Project Details */}
              <div className="project-details-panel">
                <div className="code-editor-header">
                  <div className="tab active">
                    <FaCode className="tab-icon" />
                    {currentProject?.title || 'Untitled'}.js
                  </div>
                </div>
                
                <div className="project-details-content">
                  {projects.length > 0 && currentProject ? (
                    <>
                      <div className="code-line comment">
                        <span className="line-number">01</span>
                        <span>{`// ${currentProject.title} - System Description`}</span>
                      </div>
                      <div className="code-line">
                        <span className="line-number">02</span>
                        <span className="keyword">const</span> <span className="variable">project</span> = <span className="brace">{'{'}</span>
                      </div>
                      <div className="code-line">
                        <span className="line-number">03</span>
                        &nbsp;&nbsp;<span className="property">description</span>: <span className="string">"
                          <TypewriterEffect 
                            text={currentProject.description} 
                            speed={20} 
                          />"</span>,
                      </div>
                      <div className="code-line">
                        <span className="line-number">04</span>
                        &nbsp;&nbsp;<span className="property">technologies</span>: [
                      </div>
                      <div className="code-line">
                        <span className="line-number">05</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="tech-stack-display">
                          {currentProject.technologies?.map((tech, i) => (
                            <span key={tech} className="tech-token">
                              <span className="string">'{tech}'</span>{i < currentProject.technologies.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="code-line">
                        <span className="line-number">06</span>
                        &nbsp;&nbsp;],
                      </div>
                      <div className="code-line">
                        <span className="line-number">07</span>
                        &nbsp;&nbsp;<span className="property">actions</span>: <span className="brace">{'{'}</span>
                      </div>
                      <div className="code-line">
                        <span className="line-number">08</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">{`// Initialize connection protocols`}</span>
                      </div>
                      
                      <div className="project-actions-area">
                        {currentProject.project_url && (
                          <a 
                            href={currentProject.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="terminal-btn primary"
                          >
                            <FaExternalLinkAlt /> LAUNCH_DEMO()
                          </a>
                        )}
                        {currentProject.code_url && (
                          <a 
                            href={currentProject.code_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="terminal-btn secondary"
                          >
                            <FaCode /> VIEW_SOURCE()
                          </a>
                        )}
                      </div>

                      <div className="code-line">
                        <span className="line-number">09</span>
                        &nbsp;&nbsp;<span className="brace">{'}'}</span>
                      </div>
                      <div className="code-line">
                        <span className="line-number">10</span>
                        <span className="brace">{'}'}</span>;
                      </div>
                    </>
                  ) : (
                    <div className="no-projects-details">
                      <p>{t.noProjects}</p>
                    </div>
                  )}
                </div>
                
                <div className="terminal-footer">
                  <span>UTF-8</span>
                  <span>JavaScript</span>
                  <span>Ln 3, Col 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;