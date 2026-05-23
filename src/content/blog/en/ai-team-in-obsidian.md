---
title: "I Built an AI Team in Obsidian — Here's the Architecture"
description: "How I designed ABC TOM, a multi-agent AI system running entirely in Obsidian with Claude."
date: 2026-03-20
category: tech
tags: ["ai-agents", "obsidian", "architecture", "myteam"]
draft: false
---

Most people use AI as a chatbot. Ask a question, get an answer, forget the context, start over. I wanted something different: a persistent team of AI agents that remembers everything, learns from its mistakes, and works together through structured pipelines.

So I built MyTeam — a multi-agent AI orchestration system running entirely inside Obsidian. No custom infrastructure. No cloud deployments. Just Markdown files, Claude, and a framework I call **ABC TOM**.

## What is ABC TOM?

ABC TOM stands for **Agents — Brain — Core — Tools — Output — Memory**. It is the architectural backbone of the entire system.

Here is what each layer does:

### Agents

The system has 12+ specialized agents, each with a distinct role, personality, and set of instructions:

- **Klonimus** — Chief of Staff. The orchestrator. Every task from the CEO (me) flows through Klonimus first. He decides which agent handles it, structures the brief, and manages the pipeline.
- **Quant** — Algorithmic trading specialist. Analyzes market data, backtests strategies, writes trading logic.
- **Architect** — System designer. Takes strategy documents and produces detailed technical architecture specs.
- **Coder** — Builder. Takes architecture specs and writes production code.
- **Reviewer** — Quality gate. Reviews every output before it reaches the CEO. Catches errors, suggests improvements.
- **Strategist** — Thinks about positioning, goals, and long-term direction. Produces strategy documents.
- **Critic** — The devil's advocate. Stress-tests ideas, finds weaknesses, asks uncomfortable questions.
- **Scout** — Research agent. Scans for trends, tools, and opportunities.
- **Visionary** — Big-picture thinker. Connects dots across domains. Asks "what if?"
- **Disruptor** — Challenges assumptions. Looks at problems from unconventional angles.
- **Builder** — Turns validated ideas into actionable project plans.
- **Academic Assistant** — Helps with university coursework (Calculus 2, Mechanics at the Open University of Israel).
- **Maven** — Content expert. Writes blog posts, refines copy, ensures the voice is authentic.

Each agent has its own Markdown file with a system prompt, context rules, and behavioral guidelines. They are not generic — they are tuned for specific tasks within the system.

### Brain

The Brain layer contains all strategic thinking, analyses, and decision documents. When the Strategist produces a market analysis or the Critic tears apart a business plan, those outputs live in the Brain. It is the system's strategic memory.

### Core

Core holds the foundational configuration: the ABC TOM framework definition, agent registry, pipeline rules, and system-level prompts. Think of it as the operating system of the team.

### Tools

Reusable utilities, scripts, templates, and automation. Python scripts for data analysis, email senders, report generators — anything that agents reference or execute.

### Output

The final deliverables. Every pipeline ends with an output: a deployed website, a trading strategy document, a research report, an email draft. Output is the artifact layer.

### Memory

This is the most important layer. Memory is what separates MyTeam from a collection of chat sessions.

## The Memory-First Learning Loop

Here is the critical insight: **AI agents without persistent memory make the same mistakes forever.**

Every time an agent completes a task, three things happen:

1. **The output is stored** in the Output layer with full context about who made it, when, and why.
2. **Feedback is captured** — the CEO or Reviewer provides explicit feedback on what worked and what did not.
3. **Memory is updated** — the relevant agent's memory file is appended with the lesson learned.

The next time that agent handles a similar task, it reads its memory first. It sees past mistakes, past successes, and explicit instructions like "never do X" or "always prefer Y."

This creates a compounding effect. The system gets measurably better over weeks of use. Not through fine-tuning or retraining — just through structured Markdown notes that persist across sessions.

## Pipeline Flows

Nothing happens in isolation. Every task follows a pipeline:

```
CEO → Klonimus → Agent → Reviewer → Output
```

For example, building this website:

1. **CEO** says: "I need a personal website."
2. **Klonimus** breaks this down: first strategy, then architecture, then code.
3. **Strategist** produces `Website_Strategy.md` — positioning, content pillars, technical requirements.
4. **Reviewer** validates the strategy.
5. **Architect** takes the strategy and produces `Website_Architecture.md` — complete component specs, data models, routing.
6. **Reviewer** validates the architecture.
7. **Coder** takes the architecture and builds the site.
8. **Reviewer** validates the code.
9. **Output** — deployed website.

Every handoff includes the full context. The Coder does not just receive "build a website" — it receives a 60-section architecture document with TypeScript interfaces, component props, color tokens, and routing rules.

## Why This Matters

The conventional approach to AI is stateless. You open ChatGPT, have a conversation, close the tab. Tomorrow you start from zero.

MyTeam inverts this. Every interaction adds to a growing knowledge base. The agents develop institutional memory. They learn my preferences, my codebase, my writing style, my trading rules.

After three months of use, the system produces first drafts that need minimal editing. The Reviewer catches patterns it has seen before. The Coder follows conventions established in previous projects. The Maven writes in my voice because it has dozens of examples in memory.

This is not AGI. It is not sentient. It is a well-organized filing system with smart automation. But it is remarkably effective.

## The Tech Stack

The entire system runs on:

- **Obsidian** — the Markdown editor and knowledge graph
- **Claude** — the language model powering every agent
- **Markdown** — the universal format for all documents
- **Git** — version control for the knowledge base
- **Python** — scripting for tools and automation
- **TypeScript** — web development tooling

No databases. No APIs (beyond Claude). No microservices. The simplicity is the feature.

## What I Learned

Building MyTeam taught me something I did not expect: the bottleneck in AI productivity is not the model — it is the context management. GPT-4, Claude, Gemini — they are all capable enough. What makes the difference is whether the model has access to the right context at the right time.

The ABC TOM framework is essentially a context management system. It ensures that every agent, on every task, has exactly the context it needs — no more, no less.

If you are building with AI and hitting a ceiling, the answer is probably not a better model. It is better memory.

---

*This is the first post on this blog. More coming on trading algorithms, AI systems, and the strange intersection of sport psychology and software engineering.*
