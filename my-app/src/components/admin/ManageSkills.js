import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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
      resetForm();
      fetchSkills();
    } else {
      console.error("Error saving skill", error);
      alert("Error saving skill: " + error.message);
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
    await supabase.from('skills').delete().eq('id', id);
    fetchSkills();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Skills</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
        <form onSubmit={saveSkill} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            value={name} onChange={(e) => setName(e.target.value)} 
            placeholder="Skill Name (e.g. React)" required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            value={category} onChange={(e) => setCategory(e.target.value)} 
            placeholder="Category (e.g. Frontend, Backend)" required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <label style={{ flex: 1 }}>
              Level (1-10): {level}
              <input 
                type="range" min="1" max="10" 
                value={level} onChange={(e) => setLevel(e.target.value)} 
                style={{ width: '100%', marginTop: '5px' }}
              />
            </label>
            <label style={{ flex: 1 }}>
              Brand Color:
              <input 
                type="color" 
                value={color} onChange={(e) => setColor(e.target.value)} 
                style={{ width: '100%', height: '40px', marginTop: '5px', padding: '2px' }}
              />
            </label>
          </div>
          <input 
            value={iconName} onChange={(e) => setIconName(e.target.value)} 
            placeholder="React Icon Name (e.g. FaReact, SiPhp)" required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ flex: 1, padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill'}
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
        <h3>Current Skills</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {skills.map(skill => (
            <li key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <div style={{ width: '20px', height: '20px', backgroundColor: skill.color, borderRadius: '4px' }}></div>
                 <strong style={{ fontSize: '18px' }}>{skill.name}</strong>
                 <span style={{ color: '#666', background: '#f4f4f4', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{skill.category}</span>
                 <span style={{ color: '#888', fontSize: '12px' }}>Level: {skill.level}/10 ({skill.icon_name})</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                   onClick={() => startEdit(skill)}
                   style={{ padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                   Edit
                </button>
                <button 
                   onClick={() => deleteSkill(skill.id)}
                   style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                   Delete
                </button>
              </div>
            </li>
          ))}
          {skills.length === 0 && <p style={{ color: '#666' }}>No skills yet.</p>}
        </ul>
      </div>
    </div>
  );
}
