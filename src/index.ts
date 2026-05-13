interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * bioRxiv / medRxiv MCP
 *
 * Auth: none. Docs: https://api.biorxiv.org/
 */


const BASE = 'https://api.biorxiv.org';
const UA = 'pipeworx-mcp-biorxiv/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'details',
    description: 'Preprint metadata by DOI or by date / date range.',
    inputSchema: {
      type: 'object',
      properties: {
        server: { type: 'string', description: 'biorxiv | medrxiv' },
        doi: { type: 'string', description: 'e.g. "10.1101/2024.01.15.575982" (mutually exclusive with date)' },
        date_or_range: { type: 'string', description: 'YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD' },
        cursor: { type: 'number', description: 'Pagination offset (default 0).' },
      },
      required: ['server'],
    },
  },
  {
    name: 'published',
    description: 'Preprints that have since been published in a peer-reviewed journal.',
    inputSchema: {
      type: 'object',
      properties: {
        server: { type: 'string' },
        date_or_range: { type: 'string' },
        cursor: { type: 'number' },
      },
      required: ['server', 'date_or_range'],
    },
  },
  {
    name: 'publisher',
    description: 'Preprints subsequently published by a given DOI prefix (e.g. "10.1038" for Nature).',
    inputSchema: {
      type: 'object',
      properties: {
        server: { type: 'string' },
        prefix: { type: 'string', description: 'DOI prefix, e.g. "10.1038"' },
        date_or_range: { type: 'string' },
        cursor: { type: 'number' },
      },
      required: ['server', 'prefix', 'date_or_range'],
    },
  },
  {
    name: 'summary',
    description: 'bioRxiv submission/publication counts. Interval: "m" (monthly, default) or "y" (yearly). bioRxiv only — medRxiv has no /sum endpoint.',
    inputSchema: {
      type: 'object',
      properties: { interval: { type: 'string', description: '"m" (monthly, default) or "y" (yearly)' } },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'details': {
      const server = reqServer(args);
      const cursor = (args.cursor as number) ?? 0;
      const doi = args.doi as string | undefined;
      const date = args.date_or_range as string | undefined;
      if (!doi && !date) throw new Error('Pass either "doi" or "date_or_range".');
      const idPart = doi ?? date;
      return rxGet(`/details/${server}/${encodeURI(idPart!)}/${cursor}`);
    }
    case 'published': {
      const server = reqServer(args);
      const date = reqStr(args, 'date_or_range', '"2024-01-01/2024-01-31"');
      const cursor = (args.cursor as number) ?? 0;
      return rxGet(`/pubs/${server}/${encodeURI(date)}/${cursor}`);
    }
    case 'publisher': {
      const server = reqServer(args);
      const prefix = reqStr(args, 'prefix', '"10.1038"');
      const date = reqStr(args, 'date_or_range', '"2024-01-01/2024-01-31"');
      const cursor = (args.cursor as number) ?? 0;
      return rxGet(`/publisher/${prefix}/${encodeURI(date)}/${cursor}`);
    }
    case 'summary': {
      const interval = ((args.interval as string) ?? 'm').toLowerCase();
      if (interval !== 'm' && interval !== 'y') throw new Error('interval must be "m" or "y".');
      return rxGet(`/sum/${interval}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqServer(args: Record<string, unknown>): 'biorxiv' | 'medrxiv' {
  const s = reqStr(args, 'server', '"biorxiv"').toLowerCase();
  if (s !== 'biorxiv' && s !== 'medrxiv') throw new Error(`server must be "biorxiv" or "medrxiv", got "${s}".`);
  return s;
}

async function rxGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`bioRxiv: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
