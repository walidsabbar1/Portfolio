import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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
      resetForm();
      fetchExperiences();
    } else {
      console.error("Error saving experience", error);
      alert("Error saving experience: " + error.message);
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
    await supabase.from('experience').delete().eq('id', id);
    fetchExperiences();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Experience</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
        <form onSubmit={saveExperience} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} 
              placeholder="Job Title (e.g. Senior Developer)" required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
            <input 
              value={company} onChange={(e) => setCompany(e.target.value)} 
              placeholder="Company Name" required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              value={startDate} onChange={(e) => setStartDate(e.target.value)} 
              placeholder="Start Date (e.g. Jan 2020)" required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
            <input 
              value={endDate} onChange={(e) => setEndDate(e.target.value)} 
              placeholder="End Date (e.g. Present)" required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
          </div>
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)} 
            placeholder="Description of duties/achievements" 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ flex: 1, padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Saving...' : editingId ? 'Update Experience' : 'Add Experience'}
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
        <h3>Experience Timeline</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {experiences.map(exp => (
            <li key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
              <div>
                 <strong style={{ display: 'block', fontSize: '18px', marginBottom: '5px' }}>{exp.job_title} at {exp.company}</strong>
                 <small style={{ color: '#666', display: 'block' }}>{exp.start_date} - {exp.end_date}</small>
                 <p style={{ margin: '5px 0 0 0', color: '#444', fontSize: '14px' }}>{exp.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                   onClick={() => startEdit(exp)}
                   style={{ padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                   Edit
                </button>
                <button 
                   onClick={() => deleteExperience(exp.id)}
                   style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                   Delete
                </button>
              </div>
            </li>
          ))}
          {experiences.length === 0 && <p style={{ color: '#666' }}>No experience listed yet.</p>}
        </ul>
      </div>
    </div>
  );
}
