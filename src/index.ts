import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

import express from "express";

const app = express();

// Create server instance
const server = new McpServer(
  {
    name: "my-mcp-weather",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function getWeather(state: string) {
  return {
    temp: 70,
    condition: "sunny",
  };
}

server.tool(
  "get-weather",
  {
    state: z.string(),
  },
  async ({ state }) => {
    const weather = await getWeather(state);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(weather),
        },
      ],
    };
  }
);

let transport: SSEServerTransport | null = null;

app.get("/sse", (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  server.connect(transport);
});

app.post("/messages", (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res);
  }
});

app.listen(3000, () => {
  console.log("MCP server is running on port 3000");
});
