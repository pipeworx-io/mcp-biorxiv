# mcp-biorxiv

bioRxiv / medRxiv MCP

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `details` | Preprint metadata by DOI or by date / date range. |
| `published` | Preprints that have since been published in a peer-reviewed journal. |
| `publisher` | Preprints subsequently published by a given DOI prefix (e.g. "10.1038" for Nature). |
| `summary` | bioRxiv submission/publication counts. Interval: "m" (monthly, default) or "y" (yearly). bioRxiv only — medRxiv has no /sum endpoint. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "biorxiv": {
      "url": "https://gateway.pipeworx.io/biorxiv/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Biorxiv data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
