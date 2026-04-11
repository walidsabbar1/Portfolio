import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function ManageProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    bio: '',
    hero_text: '',
    contact_email: '',
    resume_url: '',
    github_url: '',
    linkedin_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from('profile_info').select('*').limit(1).single();
    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        title: data.title || '',
        bio: data.bio || '',
        hero_text: data.hero_text || '',
        contact_email: data.contact_email || '',
        resume_url: data.resume_url || '',
        github_url: data.github_url || '',
        linkedin_url: data.linkedin_url || ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to save.");
      setLoading(false);
      return;
    }

    if (profile?.id) {
      // Update existing
      const { error } = await supabase.from('profile_info').update(formData).eq('id', profile.id);
      if (error) alert("Error: " + error.message);
      else alert("Profile updated successfully!");
    } else {
      // Insert new
      const { error } = await supabase.from('profile_info').insert([{ ...formData, user_id: user.id }]);
      if (error) alert("Error: " + error.message);
      else {
        alert("Profile created successfully!");
        fetchProfile();
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Profile Settings</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
            <input 
              name="full_name" value={formData.full_name} onChange={handleChange} 
              style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Professional Title</label>
            <input 
              name="title" value={formData.title} onChange={handleChange} 
              placeholder="e.g. Full Stack Developer"
              style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Home Page Hero Text</label>
            <textarea 
              name="hero_text" value={formData.hero_text} onChange={handleChange} 
              placeholder="Short text introducing yourself on the home page"
              style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>About Me (Bio)</label>
            <textarea 
              name="bio" value={formData.bio} onChange={handleChange} 
              placeholder="Longer description for the About page"
              style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', minHeight: '120px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Contact Email</label>
              <input 
                name="contact_email" value={formData.contact_email} onChange={handleChange} 
                style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Resume PDF URL</label>
              <input 
                name="resume_url" value={formData.resume_url} onChange={handleChange} 
                style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>GitHub Profile URL</label>
              <input 
                name="github_url" value={formData.github_url} onChange={handleChange} 
                style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>LinkedIn Profile URL</label>
              <input 
                name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} 
                style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            {loading ? 'Saving...' : 'Save Profile Details'}
          </button>
        </form>
      </div>
    </div>
  );
}
