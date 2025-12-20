#!/usr/bin/env node

const SimpleWebScraper = require('./simple-web-scraper');

class MCPServer {
    constructor() {
        this.scraper = new SimpleWebScraper();
        this.stdin = process.stdin;
        this.stdout = process.stdout;
        this.buffer = '';
    }

    async init() {
        // Start listening for stdin
        this.stdin.setEncoding('utf8');
        this.stdin.on('data', (chunk) => {
            this.buffer += chunk;
            this.processMessages();
        });

        // Signal ready
        this.sendResponse({
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {
                    tools: {
                        listChanged: false
                    }
                },
                serverInfo: {
                    name: 'web-scraper',
                    version: '1.0.0'
                }
            }
        });
    }

    processMessages() {
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop(); // Keep the incomplete line in buffer

        for (const line of lines) {
            if (line.trim()) {
                try {
                    const message = JSON.parse(line);
                    this.handleMessage(message).catch(error => {
                        console.error('Error handling message:', error);
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
        }
    }

    async handleMessage(message) {
        const { id, method, params } = message;

        try {
            let result;

            switch (method) {
                case 'initialize':
                    result = {
                        protocolVersion: '2024-11-05',
                        capabilities: {
                            tools: {}
                        }
                    };
                    break;

                case 'tools/list':
                    result = {
                        tools: [
                            {
                                name: 'scrape_webpage',
                                description: 'Extract content from a web page including title, description, and text content',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        url: {
                                            type: 'string',
                                            description: 'The URL of the web page to scrape'
                                        }
                                    },
                                    required: ['url']
                                }
                            },
                            {
                                name: 'fetch_html',
                                description: 'Fetch the raw HTML content of a web page',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        url: {
                                            type: 'string',
                                            description: 'The URL of the web page to fetch'
                                        }
                                    },
                                    required: ['url']
                                }
                            }
                        ]
                    };
                    break;

                case 'tools/call':
                    result = await this.handleToolCall(params);
                    break;

                default:
                    throw new Error(`Unknown method: ${method}`);
            }

            this.sendResponse({
                jsonrpc: '2.0',
                id: id,
                result: result
            });
        } catch (error) {
            this.sendResponse({
                jsonrpc: '2.0',
                id: id,
                error: {
                    code: -32603,
                    message: error.message
                }
            });
        }
    }

    async handleToolCall(params) {
        const { name, arguments: args } = params;

        switch (name) {
            case 'scrape_webpage':
                const scrapeResult = await this.scraper.scrape(args.url);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(scrapeResult, null, 2)
                        }
                    ]
                };

            case 'fetch_html':
                const htmlResult = await this.scraper.scrape(args.url);
                return {
                    content: [
                        {
                            type: 'text',
                            text: htmlResult.htmlContent
                        }
                    ]
                };

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }

    sendResponse(response) {
        const json = JSON.stringify(response);
        this.stdout.write(json + '\n');
        this.stdout.flush?.();
    }
}

// Start the server
if (require.main === module) {
    const server = new MCPServer();
    server.init().catch(error => {
        console.error('Server initialization error:', error);
        process.exit(1);
    });
}