import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function ManageEducation() {
  const [educations, setEducations] = useState([]);
  const [degree, setDegree] = useState('');
  const [school, setSchool] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    const { data } = await supabase.from('education').select('*').order('display_order', { ascending: true });
    if (data) setEducations(data);
  };

  const saveEducation = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { 
      degree,
      school,
      start_year: startYear,
      end_year: endYear,
      description
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('education').update(payload).eq('id', editingId);
      error = updateError;
    } else {
      payload.display_order = educations.length + 1;
      const { error: insertError } = await supabase.from('education').insert([payload]);
      error = insertError;
    }

    setLoading(false);

    if (!error) {
      toast.success(editingId ? "Education updated successfully!" : "Education added successfully!");
      resetForm();
      fetchEducations();
    } else {
      console.error("Error saving education", error);
      toast.error("Error saving education: " + error.message);
    }
  };

  const resetForm = () => {
    setDegree('');
    setSchool('');
    setStartYear('');
    setEndYear('');
    setDescription('');
    setEditingId(null);
  };

  const startEdit = (edu) => {
    setDegree(edu.degree);
    setSchool(edu.school);
    setStartYear(edu.start_year);
    setEndYear(edu.end_year);
    setDescription(edu.description || '');
    setEditingId(edu.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEducation = async (id) => {
    if(!window.confirm("Are you sure you want to delete this education?")) return;
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (!error) {
      toast.success("Education deleted successfully");
      fetchEducations();
    } else {
      toast.error("Failed to delete education");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Education</h1>
      
      <div className="admin-card">
        <h3 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>{editingId ? 'Edit Education' : 'Add Education'}</h3>
        <form onSubmit={saveEducation} className="admin-form">
          <div className="admin-form-row">
            <input 
              value={degree} onChange={(e) => setDegree(e.target.value)} 
              placeholder="Degree/Certificate" required 
              className="admin-input"
            />
            <input 
              value={school} onChange={(e) => setSchool(e.target.value)} 
              placeholder="School/University" required 
              className="admin-input"
            />
          </div>
          <div className="admin-form-row">
            <input 
              value={startYear} onChange={(e) => setStartYear(e.target.value)} 
              placeholder="Start Year (e.g. 2018)" required 
              className="admin-input"
            />
            <input 
              value={endYear} onChange={(e) => setEndYear(e.target.value)} 
              placeholder="End Year (e.g. 2022)" required 
              className="admin-input"
            />
          </div>
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)} 
            placeholder="Description (Optional)" 
            className="admin-input"
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="admin-btn-primary" style={{ flex: 1 }}>
              {loading ? 'Saving...' : editingId ? 'Update Education' : 'Add Education'}
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
        <h3 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>Current Education</h3>
        <div className="admin-list">
          {educations.map(edu => (
            <div key={edu.id} className="admin-list-item">
              <div className="admin-list-item-content">
                 <h3>{edu.degree}</h3>
                 <p style={{ color: '#3b82f6', fontWeight: '500', marginBottom: '0.5rem' }}>{edu.school} • {edu.start_year} - {edu.end_year}</p>
                 {edu.description && <p>{edu.description}</p>}
              </div>
              <div className="admin-list-item-actions">
                <button 
                   onClick={() => startEdit(edu)}
                   className="admin-btn-secondary">
                   Edit
                </button>
                <button 
                   onClick={() => deleteEducation(edu.id)}
                   className="admin-btn-danger">
                   Delete
                </button>
              </div>
            </div>
          ))}
          {educations.length === 0 && <p style={{ color: '#64748b' }}>No education listed yet.</p>}
        </div>
      </div>
    </div>
  );
}
