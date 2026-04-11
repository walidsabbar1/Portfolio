import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState(''); // Comma separated for now
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
    
    // Parse technologies from comma separated string
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
      resetForm();
      fetchProjects();
    } else {
      console.error("Error saving project", error);
      alert("Error saving project: " + error.message);
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
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Projects</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={saveProject} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            value={title} onChange={(e) => setTitle(e.target.value)} 
            placeholder="Project Title" required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)} 
            placeholder="Project Description" 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
          />
          <input 
            value={technologies} onChange={(e) => setTechnologies(e.target.value)} 
            placeholder="Technologies (comma separated, e.g. React, Node, CSS)" 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <div style={{ display: 'flex', gap: '15px' }}>
             <input 
               value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} 
               placeholder="Live URL" 
               style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
             />
             <input 
               value={codeUrl} onChange={(e) => setCodeUrl(e.target.value)} 
               placeholder="Code/GitHub URL" 
               style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
             />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ flex: 1, padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{ padding: '12px', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Current Projects</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map(proj => (
            <li key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
              <div>
                 <strong style={{ display: 'block', fontSize: '18px', marginBottom: '5px' }}>{proj.title}</strong>
                 <small style={{ color: '#666' }}>{proj.technologies?.join(', ')}</small>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                   onClick={() => startEdit(proj)}
                   style={{ padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                   Edit
                </button>
                <button 
                   onClick={() => deleteProject(proj.id)}
                   style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                   Delete
                </button>
              </div>
            </li>
          ))}
          {projects.length === 0 && <p style={{ color: '#666' }}>No projects yet.</p>}
        </ul>
      </div>
    </div>
  );
}
