import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function ManageExperience() {
  const [experiences, setExperiences] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data } = await supabase.from('experience').select('*').order('display_order', { ascending: true });
    if (data) setExperiences(data);
  };

  const saveExperience = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { 
      job_title: jobTitle,
      company,
      start_date: startDate,
      end_date: endDate,
      description
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('experience').update(payload).eq('id', editingId);
      error = updateError;
    } else {
      payload.display_order = experiences.length + 1;
      const { error: insertError } = await supabase.from('experience').insert([payload]);
      error = insertError;
    }

    setLoading(false);

    if (!error) {
      toast.success(editingId ? "Experience updated successfully!" : "Experience added successfully!");
      resetForm();
      fetchExperiences();
    } else {
      console.error("Error saving experience", error);
      toast.error("Error saving experience: " + error.message);
    }
  };

  const resetForm = () => {
    setJobTitle('');
    setCompany('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setEditingId(null);
  };

  const startEdit = (exp) => {
    setJobTitle(exp.job_title);
    setCompany(exp.company);
    setStartDate(exp.start_date);
    setEndDate(exp.end_date);
    setDescription(exp.description || '');
    setEditingId(exp.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteExperience = async (id) => {
    if(!window.confirm("Are you sure you want to delete this experience?")) return;
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (!error) {
       toast.success("Experience deleted successfully");
       fetchExperiences();
    } else {
       toast.error("Failed to delete experience");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Experience Timeline</h1>
      
      <div className="admin-card">
        <h3 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
        <form onSubmit={saveExperience} className="admin-form">
          <div className="admin-form-row">
            <input 
              value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} 
              placeholder="Job Title (e.g. Senior Developer)" required 
              className="admin-input"
            />
            <input 
              value={company} onChange={(e) => setCompany(e.target.value)} 
              placeholder="Company Name" required 
              className="admin-input"
            />
          </div>
          <div className="admin-form-row">
            <input 
              value={startDate} onChange={(e) => setStartDate(e.target.value)} 
              placeholder="Start Date (e.g. Jan 2020)" required 
              className="admin-input"
            />
            <input 
              value={endDate} onChange={(e) => setEndDate(e.target.value)} 
              placeholder="End Date (e.g. Present)" required 
              className="admin-input"
            />
          </div>
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)} 
            placeholder="Description of duties/achievements" 
            className="admin-input"
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="admin-btn-primary" style={{ flex: 1 }}>
              {loading ? 'Saving...' : editingId ? 'Update Experience' : 'Add Experience'}
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
        <h3 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>Current Timeline</h3>
        <div className="admin-list">
          {experiences.map(exp => (
            <div key={exp.id} className="admin-list-item">
              <div className="admin-list-item-content">
                 <h3>{exp.job_title} at {exp.company}</h3>
                 <p style={{ color: '#3b82f6', fontWeight: '500', marginBottom: '0.5rem' }}>{exp.start_date} - {exp.end_date}</p>
                 <p>{exp.description}</p>
              </div>
              <div className="admin-list-item-actions">
                <button 
                   onClick={() => startEdit(exp)}
                   className="admin-btn-secondary">
                   Edit
                </button>
                <button 
                   onClick={() => deleteExperience(exp.id)}
                   className="admin-btn-danger">
                   Delete
                </button>
              </div>
            </div>
          ))}
          {experiences.length === 0 && <p style={{ color: '#64748b' }}>No experience listed yet.</p>}
        </div>
      </div>
    </div>
  );
}
