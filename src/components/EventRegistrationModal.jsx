import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EventRegistrationModal({ isOpen, onClose, eventId, eventTitle, eventCustomFields }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rname: '',
    remail: '',
    rphone: '',
    rroll: '',
    rbranch: '',
    ryear: ''
  });

  const [customResponses, setCustomResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', isError: false });

  // Parse custom fields if passed as JSON string or array
  const parsedCustomFields = React.useMemo(() => {
    if (!eventCustomFields) return [];
    if (Array.isArray(eventCustomFields)) return eventCustomFields;
    if (typeof eventCustomFields === 'string' && eventCustomFields.trim()) {
      try { return JSON.parse(eventCustomFields); } catch (e) { return []; }
    }
    return [];
  }, [eventCustomFields]);

  useEffect(() => {
    if (isOpen) {
      setAlertInfo({ show: false, message: '', isError: false });
      setFormData({
        rname: user?.name || '',
        remail: user?.email || '',
        rphone: '',
        rroll: user?.roll_number || '',
        rbranch: user?.branch || '',
        ryear: user?.year || ''
      });
      setCustomResponses({});
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomChange = (label, val) => {
    setCustomResponses(prev => ({ ...prev, [label]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertInfo({ show: false, message: '', isError: false });

    const payload = {
      event_id: eventId || 1,
      event_title: eventTitle || 'EQUINOX 3.0',
      student_name: formData.rname,
      student_email: formData.remail,
      phone: formData.rphone,
      roll_number: formData.rroll,
      branch: formData.rbranch,
      year: formData.ryear,
      custom_responses: customResponses
    };

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setAlertInfo({ show: true, message: `✅ ${data.message}`, isError: false });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setAlertInfo({ show: true, message: `⚠️ ${data.error || 'Registration failed.'}`, isError: true });
        setLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setAlertInfo({ show: true, message: '⚠️ Network error. Please try again.', isError: true });
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(15,27,60,0.75)', backdropFilter: 'blur(6px)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: '16px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>
        <div className="section-tag" style={{ marginBottom: '8px' }}>EVENT REGISTRATION</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '24px', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>Register for {eventTitle}</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', display: 'block' }}>Full Name *</label>
              <input type="text" name="rname" value={formData.rname} onChange={handleChange} required placeholder="John Doe" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', display: 'block' }}>Email Address *</label>
              <input type="email" name="remail" value={formData.remail} onChange={handleChange} required placeholder="student@ku.edu.in" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', display: 'block' }}>Mobile Number *</label>
              <input type="tel" name="rphone" value={formData.rphone} onChange={handleChange} required placeholder="9876543210" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', display: 'block' }}>Roll / Enrolment No *</label>
              <input type="text" name="rroll" value={formData.rroll} onChange={handleChange} required placeholder="UIT2024001" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', display: 'block' }}>Branch *</label>
              <select name="rbranch" value={formData.rbranch} onChange={handleChange} required style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}>
                <option value="" disabled>Select Branch</option>
                <option value="Computer Science (CSE)">CSE</option>
                <option value="Information Technology (IT)">IT</option>
                <option value="AI & Machine Learning">AI & ML</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="ECE / EE">ECE / EE</option>
                <option value="Civil Engineering">Civil</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', display: 'block' }}>Academic Year *</label>
              <select name="ryear" value={formData.ryear} onChange={handleChange} required style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}>
                <option value="" disabled>Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* DYNAMIC CUSTOM FIELDS DEFINED BY ADMIN */}
            {parsedCustomFields.length > 0 && (
              <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--navy)', display: 'block', marginBottom: '12px' }}>
                  📋 Event Specific Information
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {parsedCustomFields.map((field, idx) => {
                    const isFull = field.type === 'checkbox' || (field.options && field.options.length > 30);
                    return (
                      <div key={idx} style={{ gridColumn: isFull ? 'span 2' : 'span 1' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px', display: 'block' }}>
                          {field.label} {field.required ? '*' : ''}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            value={customResponses[field.label] || ''}
                            onChange={(e) => handleCustomChange(field.label, e.target.value)}
                            required={field.required}
                            style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}
                          >
                            <option value="">Select option...</option>
                            {(field.options || '').split(',').map((opt, i) => (
                              <option key={i} value={opt.trim()}>{opt.trim()}</option>
                            ))}
                          </select>
                        ) : field.type === 'checkbox' ? (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={!!customResponses[field.label]}
                              onChange={(e) => handleCustomChange(field.label, e.target.checked ? 'Yes' : 'No')}
                            />
                            Yes
                          </label>
                        ) : (
                          <input
                            type={field.type === 'number' ? 'number' : 'text'}
                            value={customResponses[field.label] || ''}
                            onChange={(e) => handleCustomChange(field.label, e.target.value)}
                            required={field.required}
                            placeholder={`Enter ${field.label}...`}
                            style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {alertInfo.show && (
            <div style={{ marginTop: '14px', padding: '10px', borderRadius: '6px', fontSize: '12px', background: alertInfo.isError ? '#ffebee' : '#e8f5e9', color: alertInfo.isError ? '#c62828' : '#2e7d32' }}>
              {alertInfo.message}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center', cursor: 'pointer' }}>
            {loading ? 'Registering...' : 'Confirm Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
