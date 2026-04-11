import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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
      resetForm();
      fetchEducations();
    } else {
      console.error("Error saving education", error);
      alert("Error saving education: " + error.message);
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
    await supabase.from('education').delete().eq('id', id);
    fetchEducations();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Education</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>{editingId ? 'Edit Education' : 'Add Education'}</h3>
        <form onSubmit={saveEducation} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              value={degree} onChange={(e) => setDegree(e.target.value)} 
              placeholder="Degree/Certificate" required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
            <input 
              value={school} onChange={(e) => setSchool(e.target.value)} 
              placeholder="School/University" required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              value={startYear} onChange={(e) => setStartYear(e.target.value)} 
              placeholder="Start Year (e.g. 2018)" required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
            <input 
              value={endYear} onChange={(e) => setEndYear(e.target.value)} 
              placeholder="End Year (e.g. 2022)" required 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
          </div>
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)} 
            placeholder="Description (Optional)" 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ flex: 1, padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Saving...' : editingId ? 'Update Education' : 'Add Education'}
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
        <h3>Current Education</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {educations.map(edu => (
            <li key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
              <div>
                 <strong style={{ display: 'block', fontSize: '18px', marginBottom: '5px' }}>{edu.degree}</strong>
                 <p style={{ margin: '0', color: '#444' }}>{edu.school} • {edu.start_year} - {edu.end_year}</p>
                 {edu.description && <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>{edu.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                   onClick={() => startEdit(edu)}
                   style={{ padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                   Edit
                </button>
                <button 
                   onClick={() => deleteEducation(edu.id)}
                   style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                   Delete
                </button>
              </div>
            </li>
          ))}
          {educations.length === 0 && <p style={{ color: '#666' }}>No education listed yet.</p>}
        </ul>
      </div>
    </div>
  );
}
