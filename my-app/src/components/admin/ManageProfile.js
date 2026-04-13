import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

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
      toast.error("You must be logged in to save.");
      setLoading(false);
      return;
    }

    if (profile?.id) {
      // Update existing
      const { error } = await supabase.from('profile_info').update(formData).eq('id', profile.id);
      if (error) toast.error("Error: " + error.message);
      else toast.success("Profile updated successfully!");
    } else {
      // Insert new
      const { error } = await supabase.from('profile_info').insert([{ ...formData, user_id: user.id }]);
      if (error) toast.error("Error: " + error.message);
      else {
        toast.success("Profile created successfully!");
        fetchProfile();
      }
    }

    setLoading(false);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Profile Settings</h1>
      
      <div className="admin-card">
        <form onSubmit={saveProfile} className="admin-form">
          
          <div className="admin-form-group">
            <label className="admin-label">Full Name</label>
            <input 
              name="full_name" value={formData.full_name} onChange={handleChange} 
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Professional Title</label>
            <input 
              name="title" value={formData.title} onChange={handleChange} 
              placeholder="e.g. Full Stack Developer"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Home Page Hero Text</label>
            <textarea 
              name="hero_text" value={formData.hero_text} onChange={handleChange} 
              placeholder="Short text introducing yourself on the home page"
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">About Me (Bio)</label>
            <textarea 
              name="bio" value={formData.bio} onChange={handleChange} 
              placeholder="Longer description for the About page"
              className="admin-input" style={{ minHeight: '150px' }}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Contact Email</label>
              <input 
                name="contact_email" value={formData.contact_email} onChange={handleChange} 
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Resume PDF URL</label>
              <input 
                name="resume_url" value={formData.resume_url} onChange={handleChange} 
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">GitHub Profile URL</label>
              <input 
                name="github_url" value={formData.github_url} onChange={handleChange} 
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">LinkedIn Profile URL</label>
              <input 
                name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} 
                className="admin-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="admin-btn-primary" style={{ marginTop: '10px' }}>
            {loading ? 'Saving...' : 'Save Profile Details'}
          </button>
        </form>
      </div>
    </div>
  );
}
