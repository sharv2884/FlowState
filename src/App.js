import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, //fn to create connection between nodes
  Background, //the grid pattern in the site
  Controls, //zoom/pan 
  MiniMap //overview of the entire flow
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
    },
    {
      id: '4',
      type: 'default',
      data: { label: '⏰ Schedule Trigger' },
      position: { x: 100, y: 200 },
      style: { background: '#f59e0b', color: 'white', padding: 10 }
    }
  ]);
  /*each of the node has:
  id: identifier
  type: default is a rectangular node
  data.label: the text which is displayed on canvas
  position: x y coordinates
  style: colour padding */

  // Lines connecting nodes
  const [edges, setEdges] = useState([]); //stores the connection between nodes

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