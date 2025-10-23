import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

function App() {
  // Initial nodes - just 3 boxes on screen
  const [nodes, setNodes] = useState([
    {
      id: '1',
      type: 'default',
      data: { label: '🎣 Webhook Trigger' },
      position: { x: 250, y: 50 },
      style: { background: '#3b82f6', color: 'white', padding: 10 }
    },
    {
      id: '2',
      type: 'default',
      data: { label: '💬 Send Slack Message' },
      position: { x: 250, y: 200 },
      style: { background: '#10b981', color: 'white', padding: 10 }
    },
    {
      id: '3',
      type: 'default',
      data: { label: '📧 Send Email' },
      position: { x: 250, y: 350 },
      style: { background: '#8b5cf6', color: 'white', padding: 10 }
    }
  ]);

  // Lines connecting nodes
  const [edges, setEdges] = useState([]);

  // When you drag to connect nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default App;