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
import NodeConfigPanel from './NodeConfigPanel';

const nodeTypes = {
  custom: CustomNode
};

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeId, setNodeId] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

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

  const handleNodeClick = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    setSelectedNode(node);
  }, [nodes]);

  const saveNodeConfig = useCallback((nodeId, config) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, config } }
          : node
      )
    );
  }, []);

  const addNode = (type) => {
    const newNode = {
      id: `node-${nodeId}`,
      type: 'custom',
      data: { 
        label: getNodeLabel(type),
        color: getNodeColor(type),
        onDelete: deleteNode,
        onClick: handleNodeClick,
        config: {}
      },
      position: { 
        x: 250 + (nodeId * 20), 
        y: 100 + (nodeId * 20) 
      }
    };
    setNodes([...nodes, newNode]);
    setNodeId(nodeId + 1);
  };

  // TEST WORKFLOW FUNCTION
  // TEST WORKFLOW FUNCTION
const testWorkflow = async () => {
  setTestResult({ status: 'running', message: 'Testing workflow...' });

  try {
    // Find webhook node
    const webhookNode = nodes.find(n => n.data.label.includes('Webhook'));
    
    if (!webhookNode || !webhookNode.data.config?.url) {
      setTestResult({ 
        status: 'error', 
        message: 'No webhook URL configured. Click the webhook node to add a URL.' 
      });
      return;
    }

    // Call the webhook
    await fetch(webhookNode.data.config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors', // ← ADD THIS LINE
      body: JSON.stringify({
        message: 'Test from FlowState!',
        timestamp: new Date().toISOString(),
        nodeId: webhookNode.id
      })
    });

    // Since no-cors doesn't return response, just assume success
    setTestResult({ 
      status: 'success', 
      message: `✅ Webhook sent! Check webhook.site to see if it arrived.` 
    });

  } catch (error) {
    setTestResult({ 
      status: 'error', 
      message: `❌ Error: ${error.message}` 
    });
  }
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

        {/* Test Button */}
        <button
          onClick={testWorkflow}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '24px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          ▶ Test Workflow
        </button>

        {/* Test Result */}
        {testResult && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: testResult.status === 'success' ? '#d1fae5' : testResult.status === 'error' ? '#fee2e2' : '#e0e7ff',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#111827'
          }}>
            {testResult.message}
          </div>
        )}

        <div style={{ 
          marginTop: '24px', 
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
          onNodeClick={(event, node) => handleNodeClick(node.id)}
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

      {/* Configuration Panel */}
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSave={saveNodeConfig}
        />
      )}
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