# NeuroCache

**The memory layer for AI agents.**

*Enable persistent memory for AI systems with minimal setup.*

---

## What is NeuroCache?

NeuroCache is a **long-term memory layer** for AI agents and LLM-powered applications. It enables AI systems to **learn, store, and recall** information from past sessions, turning stateless agents into context-aware assistants.

---

## Key Capabilities

- **Episodic Memory**: Graph-based conversational context that persists across sessions
- **Profile Memory**: Long-term user facts and preferences stored in SQL
- **Working Memory**: Short-term context for the current session
- **Agent Memory Persistence**: Memory survives restarts, sessions, and model changes

---

## Quick Start

> **Prerequisites:** Requires a running server instance.

### Install

    pip install neurocache-client

### Usage

    from neurocache_client import NeuroCacheClient

    # Initialize the client
    client = NeuroCacheClient(base_url="http://localhost:8080")

    # Get or create a project
    project = client.get_or_create_project(
        org_id="my_org",
        project_id="my_project"
    )

    # Create a memory instance
    memory = project.memory(
        group_id="default",
        agent_id="travel_agent",
        user_id="alice",
        session_id="session_001"
    )

    # Add memory
    memory.add("I prefer aisle seats on flights", metadata={"category": "travel"})

    # Search memory
    results = memory.search("What are my flight preferences?")
    print(results.content.episodic_memory.long_term_memory.episodes[0].content)

---

## Integrations

Works with popular AI frameworks and tools:

- LangChain  
- LangGraph  
- CrewAI  
- LlamaIndex  
- n8n  
- other frameworks  

---

## MCP Server Support

Includes support for Model Context Protocol (MCP):

    neurocache-mcp-stdio
    neurocache-mcp-http

---

## Who Is NeuroCache For?

- Developers building AI agents and assistants  
- Researchers exploring agent architectures  
- Teams building LLM-based applications  

---

## Key Features

- Multiple memory types (working, episodic, profile)  
- Developer-friendly APIs (Python, REST, TypeScript, MCP)  
- Flexible storage (graph database + SQL)  
- LLM-agnostic  
- Can run locally or on a server  

---

## Architecture

1. Agents interact through an API layer  
2. The system processes and stores interactions  
3. Data is persisted in structured memory types  

---

## Use Cases

- CRM assistants  
- Healthcare navigation systems  
- Personal finance tools  
- Writing assistants  

---

## License

Apache 2.0