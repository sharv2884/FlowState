# FlowState

A visual workflow automation builder that connects APIs and services without code.

---

## What It Does

Automate tasks by dragging and connecting boxes:
- "When webhook called → Send Slack message → Log to database"
- "Every hour → Fetch data → Send email if condition met"

Think Zapier, but simpler.

---

## Current Status

**Day 1/14** - Basic canvas working ✅

### Working:
- ✅ Drag-and-drop workflow canvas
- ✅ 3 node types (Webhook, Slack, Email)
- ✅ Connect nodes with lines

### Coming This Week:
- Add/delete nodes (Day 2)
- Working webhook integration (Day 3)
- Python backend (Day 4)
- Execute workflows end-to-end (Day 5)

---

## Tech Stack

**Frontend:** React, ReactFlow, Zustand  
**Backend:** Python FastAPI, PostgreSQL (coming Day 4)  
**Deploy:** Vercel + Railway (coming Week 2)

---

## Setup

```bash
npm install
npm start
```
---

## Learning Goals

- Visual node-based UI
- REST APIs & async processing
- Database design
- Shipping MVPs fast