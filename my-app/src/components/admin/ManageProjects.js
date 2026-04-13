import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [codeUrl, setCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const techArray = technologies.split(',').map(t => t.trim()).filter(t => t);

    const payload = { 
      title,
      description,
      technologies: techArray,
      project_url: projectUrl,
      code_url: codeUrl
    };

    let error;
    if (editingId) {
       const { error: updateError } = await supabase.from('projects').update(payload).eq('id', editingId);
       error = updateError;
    } else {
       const { error: insertError } = await supabase.from('projects').insert([payload]);
       error = insertError;
    }

    setLoading(false);

    if (!error) {
      toast.success(editingId ? "Project updated successfully!" : "Project added successfully!");
      resetForm();
      fetchProjects();
    } else {
      console.error("Error saving project", error);
      toast.error("Error saving project: " + error.message);
    }
  };

  const resetForm = () => {
      setTitle('');
      setDescription('');
      setTechnologies('');
      setProjectUrl('');
      setCodeUrl('');
      setEditingId(null);
  };

  const startEdit = (proj) => {
      setTitle(proj.title);
      setDescription(proj.description || '');
      setTechnologies(proj.technologies ? proj.technologies.join(', ') : '');
      setProjectUrl(proj.project_url || '');
      setCodeUrl(proj.code_url || '');
      setEditingId(proj.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = async (id) => {
    if(!window.confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      toast.success("Project deleted successfully");
      fetchProjects();
    } else {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Projects</h1>
      
      <div className="admin-card">
        <h3 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={saveProject} className="admin-form">
          <input 
            value={title} onChange={(e) => setTitle(e.target.value)} 
            placeholder="Project Title" required 
            className="admin-input"
          />
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)} 
            placeholder="Project Description" 
            className="admin-input"
          />
          <input 
            value={technologies} onChange={(e) => setTechnologies(e.target.value)} 
            placeholder="Technologies (comma separated, e.g. React, Node, CSS)" 
            className="admin-input"
          />
          <div className="admin-form-row">
             <input 
               value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} 
               placeholder="Live URL" 
               className="admin-input"
             />
             <input 
               value={codeUrl} onChange={(e) => setCodeUrl(e.target.value)} 
               placeholder="Code/GitHub URL" 
               className="admin-input"
             />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="admin-btn-primary" style={{ flex: 1 }}>
              {loading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>Current Projects</h3>
        <div className="admin-list">
          {projects.map(proj => (
            <div key={proj.id} className="admin-list-item">
              <div className="admin-list-item-content">
                 <h3>{proj.title}</h3>
                 <p>{proj.technologies?.join(', ')}</p>
              </div>
              <div className="admin-list-item-actions">
                <button 
                   onClick={() => startEdit(proj)}
                   className="admin-btn-secondary">
                   Edit
                </button>
                <button 
                   onClick={() => deleteProject(proj.id)}
                   className="admin-btn-danger">
                   Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p style={{ color: '#64748b' }}>No projects yet.</p>}
        </div>
      </div>
    </div>
  );
}
