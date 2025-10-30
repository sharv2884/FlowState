import React, { useState } from 'react';

function NodeConfigPanel({ node, onClose, onSave }) {
  const [config, setConfig] = useState(node?.data?.config || {});

  if (!node) return null;

  const handleSave = () => {
    onSave(node.id, config);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '320px',
      height: '100vh',
      background: 'white',
      boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      overflowY: 'auto',
      zIndex: 1000,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          Configure Node
        </h3>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>
      </div>

      {/* Node Type Badge */}
      <div style={{
        display: 'inline-block',
        padding: '6px 12px',
        background: node.data.color,
        color: 'white',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
        marginBottom: '24px'
      }}>
        {node.data.label}
      </div>

      {/* Configuration Fields */}
      {node.data.label.includes('Webhook') && (
        <div>
          <label style={labelStyle}>Webhook URL</label>
          <input
            type="text"
            placeholder="https://webhook.site/your-unique-id"
            value={config.url || ''}
            onChange={(e) => setConfig({ ...config, url: e.target.value })}
            style={inputStyle}
          />
          <p style={helpTextStyle}>
            Paste your webhook URL from webhook.site
          </p>
        </div>
      )}

      {node.data.label.includes('Slack') && (
        <div>
          <label style={labelStyle}>Slack Webhook URL</label>
          <input
            type="text"
            placeholder="https://hooks.slack.com/services/..."
            value={config.webhookUrl || ''}
            onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            style={inputStyle}
          />
          <label style={labelStyle}>Message</label>
          <textarea
            placeholder="Hello from FlowState!"
            value={config.message || ''}
            onChange={(e) => setConfig({ ...config, message: e.target.value })}
            style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit' }}
          />
        </div>
      )}

      {node.data.label.includes('Email') && (
        <div>
          <label style={labelStyle}>To Email</label>
          <input
            type="email"
            placeholder="user@example.com"
            value={config.to || ''}
            onChange={(e) => setConfig({ ...config, to: e.target.value })}
            style={inputStyle}
          />
          <label style={labelStyle}>Subject</label>
          <input
            type="text"
            placeholder="Notification from FlowState"
            value={config.subject || ''}
            onChange={(e) => setConfig({ ...config, subject: e.target.value })}
            style={inputStyle}
          />
          <label style={labelStyle}>Message</label>
          <textarea
            placeholder="Email body..."
            value={config.body || ''}
            onChange={(e) => setConfig({ ...config, body: e.target.value })}
            style={{ ...inputStyle, minHeight: '100px', fontFamily: 'inherit' }}
          />
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          width: '100%',
          padding: '12px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          marginTop: '24px'
        }}
      >
        Save Configuration
      </button>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '8px',
  marginTop: '16px'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const helpTextStyle = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '6px'
};

export default NodeConfigPanel;