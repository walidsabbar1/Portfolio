import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState(5);
  const [iconName, setIconName] = useState('FaCode');
  const [color, setColor] = useState('#000000');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
    if (data) setSkills(data);
  };

  const saveSkill = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { 
      name,
      category,
      level: parseInt(level),
      icon_name: iconName,
      color
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('skills').update(payload).eq('id', editingId);
      error = updateError;
    } else {
      payload.display_order = skills.length + 1;
      const { error: insertError } = await supabase.from('skills').insert([payload]);
      error = insertError;
    }

    setLoading(false);

    if (!error) {
      toast.success(editingId ? "Skill updated successfully!" : "Skill added successfully!");
      resetForm();
      fetchSkills();
    } else {
      console.error("Error saving skill", error);
      toast.error("Error saving skill: " + error.message);
    }
  };

  const resetForm = () => {
      setName('');
      setCategory('');
      setLevel(5);
      setIconName('FaCode');
      setColor('#000000');
      setEditingId(null);
  };

  const startEdit = (skill) => {
      setName(skill.name);
      setCategory(skill.category);
      setLevel(skill.level);
      setIconName(skill.icon_name || 'FaCode');
      setColor(skill.color || '#000000');
      setEditingId(skill.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteSkill = async (id) => {
    if(!window.confirm("Are you sure you want to delete this skill?")) return;
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) {
      toast.success("Skill deleted successfully");
      fetchSkills();
    } else {
      toast.error("Failed to delete skill");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Skills</h1>
      
      <div className="admin-card">
        <h3 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
        <form onSubmit={saveSkill} className="admin-form">
          <input 
            value={name} onChange={(e) => setName(e.target.value)} 
            placeholder="Skill Name (e.g. React)" required 
            className="admin-input"
          />
          <input 
            value={category} onChange={(e) => setCategory(e.target.value)} 
            placeholder="Category (e.g. Frontend, Backend)" required 
            className="admin-input"
          />
          <div className="admin-form-row" style={{ alignItems: 'center' }}>
            <div className="admin-form-group">
              <label className="admin-label">Level (1-10): {level}</label>
              <input 
                type="range" min="1" max="10" 
                value={level} onChange={(e) => setLevel(e.target.value)} 
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Brand Color:</label>
              <input 
                type="color" 
                value={color} onChange={(e) => setColor(e.target.value)} 
                style={{ width: '100%', height: '40px', padding: '0', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
              />
            </div>
          </div>
          <input 
            value={iconName} onChange={(e) => setIconName(e.target.value)} 
            placeholder="React Icon Name (e.g. FaReact, SiPhp)" required 
            className="admin-input"
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="admin-btn-primary" style={{ flex: 1 }}>
              {loading ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill'}
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
        <h3 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>Current Skills</h3>
        <div className="admin-list">
          {skills.map(skill => (
            <div key={skill.id} className="admin-list-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <div style={{ width: '24px', height: '24px', backgroundColor: skill.color, borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>
                 <div>
                   <h3 style={{ margin: '0 0 0.2rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{skill.name}</h3>
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                     <span style={{ color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>{skill.category}</span>
                     <span style={{ color: '#64748b', fontSize: '12px' }}>Level: {skill.level}/10</span>
                   </div>
                 </div>
              </div>
              <div className="admin-list-item-actions">
                <button 
                   onClick={() => startEdit(skill)}
                   className="admin-btn-secondary">
                   Edit
                </button>
                <button 
                   onClick={() => deleteSkill(skill.id)}
                   className="admin-btn-danger">
                   Delete
                </button>
              </div>
            </div>
          ))}
          {skills.length === 0 && <p style={{ color: '#64748b' }}>No skills yet.</p>}
        </div>
      </div>
    </div>
  );
}
