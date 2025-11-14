from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db, WorkflowDB, ExecutionLogDB
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from typing import List, Dict, Any
from datetime import datetime

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class NodeData(BaseModel):
    id: str
    type: str
    label: str
    config: Dict[str, Any] = {}

class Edge(BaseModel):
    source: str
    target: str

class Workflow(BaseModel):
    nodes: List[NodeData]
    edges: List[Edge]

# Execute a single node
def execute_node(node: NodeData):
    """Execute a single node and return result"""
    result = {
        "nodeId": node.id,
        "label": node.label,
        "status": "success",
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        # WEBHOOK NODE
        if "Webhook" in node.label:
            url = node.config.get("url")
            if not url:
                result["status"] = "error"
                result["message"] = "No URL configured"
                return result
            
            response = requests.post(
                url,
                json={
                    "message": "Executed from FlowState Backend!",
                    "timestamp": datetime.now().isoformat(),
                    "nodeId": node.id
                },
                timeout=10
            )
            result["message"] = f"Webhook called. Status: {response.status_code}"
            result["statusCode"] = response.status_code
        
        # SLACK NODE
        elif "Slack" in node.label:
            webhook_url = node.config.get("webhookUrl")
            message = node.config.get("message", "Hello from FlowState!")
            
            if not webhook_url:
                result["status"] = "error"
                result["message"] = "No Slack webhook URL configured"
                return result
            
            response = requests.post(
                webhook_url,
                json={"text": message},
                timeout=10
            )
            result["message"] = f"Slack message sent. Status: {response.status_code}"
        
        # EMAIL NODE (placeholder for now)
        elif "Email" in node.label:
            result["message"] = "Email node executed (not implemented yet)"
        
        # HTTP REQUEST NODE
        elif "HTTP" in node.label:
            url = node.config.get("url")
            if url:
                response = requests.get(url, timeout=10)
                result["message"] = f"HTTP request sent. Status: {response.status_code}"
            else:
                result["status"] = "error"
                result["message"] = "No URL configured"
        
        # DELAY NODE
        elif "Delay" in node.label:
            import time
            delay_seconds = node.config.get("seconds", 1)
            time.sleep(delay_seconds)
            result["message"] = f"Waited {delay_seconds} seconds"
        
        # OTHER NODES (not implemented)
        else:
            result["message"] = f"{node.label} executed (placeholder)"
    
    except requests.exceptions.Timeout:
        result["status"] = "error"
        result["message"] = "Request timed out"
    except requests.exceptions.RequestException as e:
        result["status"] = "error"
        result["message"] = f"Request failed: {str(e)}"
    except Exception as e:
        result["status"] = "error"
        result["message"] = f"Error: {str(e)}"
    
    return result

# === NEW DATABASE ENDPOINTS ===

# Save workflow
@app.post("/api/workflows")
async def save_workflow(workflow: Workflow, name: str = "Untitled Workflow", db: Session = Depends(get_db)):
    """Save a workflow to database"""
    
    # Check if workflow with this name exists
    existing = db.query(WorkflowDB).filter(WorkflowDB.name == name).first()
    
    if existing:
        # Update existing workflow
        existing.nodes = [node.dict() for node in workflow.nodes]
        existing.edges = [edge.dict() for edge in workflow.edges]
        existing.updated_at = datetime.now()
        db.commit()
        db.refresh(existing)
        return {"id": existing.id, "name": existing.name, "message": "Workflow updated"}
    else:
        # Create new workflow
        db_workflow = WorkflowDB(
            name=name,
            nodes=[node.dict() for node in workflow.nodes],
            edges=[edge.dict() for edge in workflow.edges]
        )
        db.add(db_workflow)
        db.commit()
        db.refresh(db_workflow)
        return {"id": db_workflow.id, "name": db_workflow.name, "message": "Workflow saved"}

# Get all workflows
@app.get("/api/workflows")
async def get_workflows(db: Session = Depends(get_db)):
    """Get all saved workflows"""
    workflows = db.query(WorkflowDB).order_by(WorkflowDB.updated_at.desc()).all()
    return {
        "workflows": [
            {
                "id": w.id,
                "name": w.name,
                "description": w.description,
                "nodeCount": len(w.nodes),
                "edgeCount": len(w.edges),
                "createdAt": w.created_at.isoformat(),
                "updatedAt": w.updated_at.isoformat()
            }
            for w in workflows
        ]
    }

# Get single workflow
@app.get("/api/workflows/{workflow_id}")
async def get_workflow(workflow_id: int, db: Session = Depends(get_db)):
    """Get a specific workflow by ID"""
    workflow = db.query(WorkflowDB).filter(WorkflowDB.id == workflow_id).first()
    if not workflow:
        return {"error": "Workflow not found"}
    
    return {
        "id": workflow.id,
        "name": workflow.name,
        "description": workflow.description,
        "nodes": workflow.nodes,
        "edges": workflow.edges,
        "createdAt": workflow.created_at.isoformat(),
        "updatedAt": workflow.updated_at.isoformat()
    }

# Delete workflow
@app.delete("/api/workflows/{workflow_id}")
async def delete_workflow(workflow_id: int, db: Session = Depends(get_db)):
    """Delete a workflow"""
    workflow = db.query(WorkflowDB).filter(WorkflowDB.id == workflow_id).first()
    if workflow:
        db.delete(workflow)
        db.commit()
        return {"message": "Workflow deleted"}
    return {"error": "Workflow not found"}

# Main workflow execution endpoint
# Update the execute_workflow function
@app.post("/api/workflows/execute")
async def execute_workflow(workflow: Workflow, workflow_id: int = None, db: Session = Depends(get_db)):
    """Execute a workflow by running nodes in order"""
    
    print(f"\n🚀 Executing workflow with {len(workflow.nodes)} nodes")
    
    results = []
    
    for node in workflow.nodes:
        print(f"⚡ Executing: {node.label}")
        result = execute_node(node)
        results.append(result)
        print(f"   Status: {result['status']}")
        
        if result["status"] == "error":
            print(f"❌ Workflow stopped due to error in {node.label}")
            break
    
    success_count = len([r for r in results if r["status"] == "success"])
    status = "completed" if success_count == len(results) else "partial"
    
    # Save execution log to database
    if workflow_id:
        log = ExecutionLogDB(
            workflow_id=workflow_id,
            status=status,
            executed_nodes=len(results),
            total_nodes=len(workflow.nodes),
            results=results
        )
        db.add(log)
        db.commit()
    
    return {
        "status": status,
        "executedNodes": len(results),
        "totalNodes": len(workflow.nodes),
        "successCount": success_count,
        "results": results,
        "timestamp": datetime.now().isoformat()
    }

# Health check
@app.get("/")
async def root():
    return {"message": "FlowState Backend API", "status": "running"}

