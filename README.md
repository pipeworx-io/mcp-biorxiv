# @pipeworx/biorxiv

bioRxiv / medRxiv preprint API MCP. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `details(server, doi|date_or_range, cursor?)` — preprint metadata by DOI or by date / date range
- `published(server, date_or_range, cursor?)` — bioRxiv preprints that have since appeared in a journal
- `publisher(server, prefix, date_or_range, cursor?)` — preprints subsequently published by a given DOI prefix
- `summary(server)` — monthly submission/publication counts (full history)

`server`: `biorxiv` or `medrxiv`.

## Data source

`https://api.biorxiv.org/`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
