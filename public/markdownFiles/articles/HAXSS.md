---
title: "HAXSS: Hierarchical Reinforcement Learning for XSS Payload Generation"
subtitle: "Training context-aware agents that craft smarter payloads than traditional scanners"
date: "28 Nov 2025"
category: "Reinforcement Learning"
readTime: "7 min read"
---

# HAXSS: Hierarchical Reinforcement Learning for XSS Payload Generation

Cross-site scripting (XSS) is a client-side code-injection attack. It happens when an application fails to properly process user input, allowing an attacker to inject malicious code that later executes inside other users' browsers.

## How an XSS attack works

1. **Injection:** The attacker finds a vulnerable point in the page and injects a malicious payload.
2. **Trusted payload:** The vulnerable site treats the payload as harmless and embeds it into the HTML response.
3. **Execution:** When another user loads the page, the browser executes the injected script.
4. **Exploitation:** The attacker can now steal session cookies, capture keystrokes, perform user actions, or run phishing flows.

## Types of XSS

1. **Reflected XSS:** Payload is delivered via a single HTTP request/response cycle without being stored server-side.
2. **Stored XSS:** Payload is saved on the server (for example, in a database) and delivered to many users—making it the most damaging type.
3. **DOM-Based XSS:** The payload stays on the client; the DOM is modified so the script never touches the server.

## Traditional techniques

1. **Sanitisation and encoding:** Inputs are filtered or transformed (e.g., stripping `<script>`) and treated strictly as data.
2. **Black-box scanners:** Large payload libraries are fuzzed or mutated to bypass basic filters.

Limitations include low payload diversity, false positives, and poor content awareness.

## Enter HAXSS: Hierarchical RL for XSS

HAXSS proposes a proactive, reinforcement-learning-powered scanner. Two specialised RL agents learn to exploit a vulnerable app.

Definitions in this setup:

1. **Agent:** The payload generator.
2. **Environment:** The vulnerable application.
3. **Action:** Adding the next character/string/mutation to the payload.
4. **Reward:** Points for bypassing filters, injecting a script, or executing code.

The hierarchy addresses traditional limitations:

1. **Context awareness (Level 1 Agent):** Analyses HTML structure and crafts structural payloads to break out of the current context.
2. **Obfuscation (Level 2 Agent):** Learns sanitiser bypasses by observing which payloads succeed, discovering complex obfuscation tricks.

![HAXSS System Overview](/Figures/HAXSS/fig1.png)

## System overview

The diagram above shows how the agent interacts with the web app to generate and test payloads.

### RL Agent

1. At each time step $t$, the agent selects an action (next character, string, or mutation function).
2. It receives a state from the environment that summarises the app's response.
3. The reward reflects success signals (escaping context, executing scripts, etc.).

### Injection interface

Acts as a bridge between the agent and the app.

- **Receives:** Payload under construction.
- **Sends:** HTTP requests or DOM events to the target app.
- **Receives:** HTTP responses plus rendered HTML.
- **Feedback:** Extracts payload echoes and state signals to feed back to the agent.

### Web app under test (environment)

- Accepts payloads via HTTP or DOM events.
- Applies sanitisation logic.
- Returns HTTP responses and rendered pages.

### Crawler

Discovers context to support the hierarchy.

- Crawls the app to find inputs (sources) and outputs (sinks).
- Produces source–sink combinations where input can flow to output.

## Results

Table I evaluates scanners on the XP Test Bed (10 known XSS vulnerabilities).

![XP Test Bed Results](/Figures/HAXSS/table1.png)

Key takeaways:

- **Perfection and accuracy:** HAXSS finds all 10 vulnerabilities with zero false negatives.
- **Efficiency:** Needs only 724 requests for a perfect score, far fewer than scanners such as XSSer (13,010) or Arachni (3,710).

Table II compares scanners on richer, real-world apps.

![Real-world Results](/Figures/HAXSS/table2.png)

Highlights:

- **Zero false positives:** HAXSS reports 0 FPs across all targets.
- **45 true positives:** Highest TP count while maintaining reliability.

**Bottom line:** Hierarchical RL delivers context-aware payload generation with superior accuracy and competitive efficiency, making HAXSS a powerful evolution of traditional XSS scanners.
