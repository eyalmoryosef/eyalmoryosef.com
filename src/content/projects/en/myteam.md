---
title: "MyTeam AI System"
description: "Multi-agent AI orchestration system built in Obsidian using the ABC TOM architecture."
category: ai
status: active
techStack: ["Obsidian", "Claude", "Markdown", "TypeScript", "Python"]
order: 1
---

MyTeam is a multi-agent AI orchestration system that runs entirely inside Obsidian. It uses the ABC TOM framework (Agents, Brain, Core, Tools, Output, Memory) to coordinate 12+ specialized AI agents through structured pipelines.

## How It Works

Every task flows through a pipeline: CEO to Klonimus (Chief of Staff) to the appropriate specialist agent, then through a Reviewer before reaching the Output layer. Each agent has persistent memory, learning from past interactions and feedback.

## Key Features

- **12+ Specialized Agents** — each with distinct roles, from trading analysis (Quant) to code generation (Coder) to content writing (Maven)
- **Persistent Memory** — agents learn from every interaction, building institutional knowledge over time
- **Pipeline Architecture** — structured handoffs with full context at every step
- **Zero Infrastructure** — runs entirely in Obsidian with Markdown files, no databases or APIs needed
- **Memory-First Learning Loop** — feedback is captured and stored, making the system measurably better over weeks

## Why I Built It

I was frustrated with the stateless nature of AI conversations. Every new chat starts from zero. MyTeam inverts this — every interaction adds to a growing knowledge base. After months of use, agents produce first drafts that need minimal editing because they have learned my preferences, conventions, and standards.
