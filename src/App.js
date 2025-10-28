import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeId, setNodeId] = useState(1); // Track node IDs

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // NEW: Allow dragging nodes around
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        return changes.reduce((acc, change) => {
          if (change.type === 'position' && change.position) {
            return acc.map((node) =>
              node.id === change.id
                ? { ...node, position: change.position }
                : node
            );
          }
          return acc;
        }, nds);
      });
    },
    []
  );

  // Add new node with better positioning
  const addNode = (type) => {
    const newNode = {
      id: `node-${nodeId}`,
      type: 'default',
      data: { label: getNodeLabel(type) },
      // Position new nodes in center of canvas, slightly offset each time
      position: { 
        x: 250 + (nodeId * 20), 
        y: 100 + (nodeId * 20) 
      },
      style: getNodeStyle(type),
      draggable: true // Make sure nodes are draggable
    };
    setNodes([...nodes, newNode]);
    setNodeId(nodeId + 1); // Increment ID for next node
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

  const getNodeStyle = (type) => {
    const styles = {
      webhook: { background: '#3b82f6', color: 'white', padding: 10, borderRadius: 5 },
      slack: { background: '#10b981', color: 'white', padding: 10, borderRadius: 5 },
      email: { background: '#8b5cf6', color: 'white', padding: 10, borderRadius: 5 },
      sms: { background: '#f59e0b', color: 'white', padding: 10, borderRadius: 5 },
      database: { background: '#06b6d4', color: 'white', padding: 10, borderRadius: 5 },
      condition: { background: '#ef4444', color: 'white', padding: 10, borderRadius: 5 },
      delay: { background: '#6366f1', color: 'white', padding: 10, borderRadius: 5 },
      http: { background: '#14b8a6', color: 'white', padding: 10, borderRadius: 5 }
    };
    return styles[type];
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '220px', 
        background: '#f9fafb', 
        padding: '20px',
        borderRight: '2px solid #e5e7eb',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          📦 Add Nodes
        </h3>
        
        {/* Triggers Section */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#6b7280',
            marginBottom: '10px'
          }}>
            TRIGGERS
          </p>
          <button onClick={() => addNode('webhook')} style={buttonStyle('#3b82f6')}>
            🎣 Webhook
          </button>
        </div>

        {/* Actions Section */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#6b7280',
            marginBottom: '10px'
          }}>
            ACTIONS
          </p>
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

        {/* Logic Section */}
        <div>
          <p style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: '#6b7280',
            marginBottom: '10px'
          }}>
            LOGIC
          </p>
          <button onClick={() => addNode('condition')} style={buttonStyle('#ef4444')}>
            🔀 If/Else
          </button>
          <button onClick={() => addNode('delay')} style={buttonStyle('#6366f1')}>
            ⏱️ Delay
          </button>
        </div>

        {/* Stats */}
        <div style={{ 
          marginTop: '30px', 
          padding: '10px', 
          background: '#e5e7eb',
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <strong>Nodes:</strong> {nodes.length}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

// Reusable button style
const buttonStyle = (bgColor) => ({
  width: '100%',
  padding: '10px',
  marginBottom: '8px',
  background: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  textAlign: 'left',
  transition: 'opacity 0.2s',
  ':hover': {
    opacity: 0.8
  }
});

export default App;