---
title: "Cloudflare Radar Analyst"
subtitle: "A conversational chat interface for exploring global internet trends and outages using Cloudflare's Radar API and AI."
date: "13 Oct 2025"
---

## Note

The code for this project can be found on [GitHub](https://github.com/ApoorvTyagi22/CloudflareRadarAnalyst.git). The application is deployed on Cloudflare's edge network for optimal performance.

# Introduction

Cloudflare Radar Analyst is a web application that provides a conversational chat interface for exploring global internet trends and outages. Built with modern web technologies and powered by Cloudflare's infrastructure, it allows users to ask natural language questions about internet data and receive AI-generated responses based on real-time information from Cloudflare's Radar API.

# Key Features

## Chat Interface

Users can engage in natural conversations by asking questions like:

- "What were the last major internet outages?"
- "Show me global traffic trends for the past month"
- "Which countries have the highest internet speeds?"

The interface responds conversationally, making complex data accessible to non-technical users.

## Data Integration

The application integrates with Cloudflare's Radar API to fetch real-time data on:

- Internet outages and incidents
- Global traffic patterns
- Network performance metrics
- Geographic distribution of internet usage

## AI-Powered Responses

Powered by Cloudflare Workers AI using the Llama 3.1 model, the system:

- Processes user queries to determine information needs
- Decides whether to fetch fresh data from Radar API
- Generates human-readable summaries of complex datasets
- Maintains conversation context for follow-up questions

## Conversation Memory

Utilizes Cloudflare Durable Objects to store up to 30 recent messages per chat session, ensuring conversations maintain context and continuity.

# Architecture

## Frontend

Built with React + TypeScript + Vite for a lightweight, responsive chat UI. The interface features:

- Real-time message streaming
- Dark/light theme support
- Mobile-responsive design
- Intuitive chat bubbles and typing indicators

## Backend

A Cloudflare Worker serves as the application logic hub, implementing an "agent loop" that:

- Routes user queries to appropriate handlers
- Manages API calls to Radar endpoints
- Processes AI responses
- Handles conversation state persistence

## Deployment

Runs entirely on Cloudflare's global edge network, providing:

- Low-latency responses worldwide
- Automatic scaling
- Built-in security and DDoS protection
- Zero cold starts

# How It Works

1. **User Input**: User sends a message through the chat interface
2. **Query Processing**: The Worker uses AI to analyze the query and determine if Radar API data is needed
3. **Data Fetching**: If required, fetches relevant data from Cloudflare Radar API endpoints
4. **Response Generation**: AI processes the data (if fetched) and generates a conversational response
5. **Context Preservation**: Message history is saved to Durable Objects for conversation continuity

# Technical Implementation

## Agent Loop Logic

The core intelligence resides in the Worker's agent loop:

```javascript
async function handleQuery(query, history) {
  // Use AI to determine if API call is needed
  const needsData = await analyzeQuery(query);

  let context = "";
  if (needsData) {
    // Fetch relevant data from Radar API
    const data = await fetchRadarData(query);
    context = summarizeData(data);
  }

  // Generate response using AI
  const response = await generateResponse(query, context, history);

  return response;
}
```

## Data Processing

The system handles various types of Radar data:

- Outage information with geographic coordinates
- Traffic statistics by region and time period
- Performance metrics and latency data
- BGP routing information

## AI Integration

Leverages Cloudflare Workers AI for:

- Natural language understanding
- Data summarization
- Conversational response generation
- Query intent classification

# Benefits

- **Accessibility**: Makes complex internet data understandable through conversation
- **Real-time Insights**: Provides current information about global internet health
- **Scalability**: Built on serverless architecture that scales automatically
- **Performance**: Edge deployment ensures fast response times globally
- **Security**: Inherits Cloudflare's security features and compliance

# Future Enhancements

Potential improvements include:

- Integration with additional data sources
- Advanced analytics and visualization
- Multi-language support
- Voice interface capabilities
- Custom dashboard creation

# Conclusion

Cloudflare Radar Analyst demonstrates the power of combining conversational AI with real-time data APIs to create accessible, intelligent applications. By leveraging Cloudflare's infrastructure, it provides a seamless experience for exploring the complex world of global internet trends and outages.
