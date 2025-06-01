import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "my-mcp-weather",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
