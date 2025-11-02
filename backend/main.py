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

# Main workflow execution endpoint
@app.post("/api/workflows/execute")
async def execute_workflow(workflow: Workflow):
    """Execute a workflow by running nodes in order"""
    
    print(f"\n🚀 Executing workflow with {len(workflow.nodes)} nodes")
    
    results = []
    
    # For now, execute nodes in order (no branching logic yet)
    for node in workflow.nodes:
        print(f"⚡ Executing: {node.label}")
        result = execute_node(node)
        results.append(result)
        print(f"   Status: {result['status']}")
        
        # If node fails, stop execution
        if result["status"] == "error":
            print(f"❌ Workflow stopped due to error in {node.label}")
            break
    
    # Summary
    success_count = len([r for r in results if r["status"] == "success"])
    
    return {
        "status": "completed" if success_count == len(results) else "partial",
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

