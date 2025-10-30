import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls,
  MiniMap,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode
};

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeId, setNodeId] = useState(1);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // FIXED: Proper node dragging handler
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const deleteNode = useCallback((nodeIdToDelete) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
    ));
  }, []);

  const addNode = (type) => {
    const newNode = {
      id: `node-${nodeId}`,
      type: 'custom',
      data: { 
        label: getNodeLabel(type),
        color: getNodeColor(type),
        onDelete: deleteNode
      },
      position: { 
        x: 250 + (nodeId * 20), 
        y: 100 + (nodeId * 20) 
      }
    };
    setNodes([...nodes, newNode]);
    setNodeId(nodeId + 1);
  };

  const getNodeLabel = (type) => {
    const labels = {
      webhook: '🎣 Webhook Trigger',
      slack: '💬 Slack Message',
      email: '📧 Send Email',
      sms: '📱 Send SMS',
      database: '💾 Save to Database',
      condition: '🔀 If/Else',
      delay: '⏱️ Wait/Delay',
      http: '🌐 HTTP Request'
    };
    return labels[type];
  };

  const getNodeColor = (type) => {
    const colors = {
      webhook: '#3b82f6',
      slack: '#10b981',
      email: '#8b5cf6',
      sms: '#f59e0b',
      database: '#06b6d4',
      condition: '#ef4444',
      delay: '#6366f1',
      http: '#14b8a6'
    };
    return colors[type];
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '240px', 
        background: '#f9fafb', 
        padding: '20px',
        borderRight: '2px solid #e5e7eb',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '24px',
          fontSize: '20px',
          fontWeight: '600',
          color: '#111827'
        }}>
          📦 Add Nodes
        </h3>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={sectionLabel}>TRIGGERS</p>
          <button onClick={() => addNode('webhook')} style={buttonStyle('#3b82f6')}>
            🎣 Webhook
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={sectionLabel}>ACTIONS</p>
          <button onClick={() => addNode('slack')} style={buttonStyle('#10b981')}>
            💬 Slack
          </button>
          <button onClick={() => addNode('email')} style={buttonStyle('#8b5cf6')}>
            📧 Email
          </button>
          <button onClick={() => addNode('sms')} style={buttonStyle('#f59e0b')}>
            📱 SMS
          </button>
          <button onClick={() => addNode('database')} style={buttonStyle('#06b6d4')}>
            💾 Database
          </button>
          <button onClick={() => addNode('http')} style={buttonStyle('#14b8a6')}>
            🌐 HTTP Request
          </button>
        </div>

        <div>
          <p style={sectionLabel}>LOGIC</p>
          <button onClick={() => addNode('condition')} style={buttonStyle('#ef4444')}>
            🔀 If/Else
          </button>
          <button onClick={() => addNode('delay')} style={buttonStyle('#6366f1')}>
            ⏱️ Delay
          </button>
        </div>

        <div style={{ 
          marginTop: '32px', 
          padding: '12px', 
          background: '#e5e7eb',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#374151'
        }}>
          <div><strong>Nodes:</strong> {nodes.length}</div>
          <div><strong>Connections:</strong> {edges.length}</div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => node.data.color}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

const sectionLabel = {
  fontSize: '11px', 
  fontWeight: '600', 
  color: '#6b7280',
  marginBottom: '12px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase'
};

const buttonStyle = (bgColor) => ({
  width: '100%',
  padding: '12px 16px',
  marginBottom: '8px',
  background: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  textAlign: 'left',
  transition: 'all 0.2s',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
});

export default App;
