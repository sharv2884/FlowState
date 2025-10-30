import React from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, id }) {
  return (
    <div 
      onClick={() => data.onClick && data.onClick(id)}
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: data.color || '#3b82f6',
        color: 'white',
        minWidth: '180px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
      }}>
      <span>{data.label}</span>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onDelete(id);
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          border: 'none',
          borderRadius: '4px',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          fontSize: '16px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginLeft: '12px',
          fontWeight: 'bold',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.5)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
      >
        ×
      </button>

      <Handle 
        type="target" 
        position={Position.Top}
        style={{
          background: '#555',
          width: '10px',
          height: '10px',
          border: '2px solid white'
        }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{
          background: '#555',
          width: '10px',
          height: '10px',
          border: '2px solid white'
        }}
      />
    </div>
  );
}

export default CustomNode;