const puppeteer = require('puppeteer');
const express = require('express');
const { spawn } = require('child_process');

// Simple web scraper using Puppeteer
class WebScraperMCP {
    constructor() {
        this.browser = null;
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async scrapePage(url) {
        if (!this.browser) {
            await this.initialize();
        }

        const page = await this.browser.newPage();

        try {
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Extract text content
            const textContent = await page.evaluate(() => {
                // Remove script and style elements
                const scripts = document.querySelectorAll('script, style');
                scripts.forEach(el => el.remove());

                // Get main content
                const mainContent = document.querySelector('main, article, .content, #content') || document.body;

                return mainContent.innerText || document.body.innerText;
            });

            // Extract HTML
            const htmlContent = await page.content();

            // Extract title
            const title = await page.title();

            // Extract metadata
            const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => '');

            await page.close();

            return {
                url,
                title,
                description: metaDescription,
                textContent: textContent.trim(),
                htmlContent,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            await page.close();
            throw error;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// MCP Server implementation
class MCPServer {
    constructor() {
        this.scraper = new WebScraperMCP();
        this.methods = {
            'scrape': this.handleScrape.bind(this),
            'list_tools': this.handleListTools.bind(this)
        };
    }

    async handleScrape(params) {
        const { url } = params;
        if (!url) {
            throw new Error('URL is required');
        }

        try {
            const result = await this.scraper.scrapePage(url);
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async handleListTools() {
        return {
            tools: [
                {
                    name: 'scrape',
                    description: 'Scrape content from a web page',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string',
                                description: 'The URL to scrape'
                            }
                        },
                        required: ['url']
                    }
                }
            ]
        };
    }

    async handleRequest(request) {
        const { method, params } = request;

        if (this.methods[method]) {
            return await this.methods[method](params);
        } else {
            throw new Error(`Unknown method: ${method}`);
        }
    }
}

// Start server
async function main() {
    const mcpServer = new MCPServer();

    // Initialize browser
    await mcpServer.scraper.initialize();

    console.log('Web Scraper MCP Server started');
    console.log('Available methods: scrape, list_tools');

    // For testing
    process.stdin.on('data', async (data) => {
        try {
            const request = JSON.parse(data.toString());
            const response = await mcpServer.handleRequest(request);
            console.log(JSON.stringify(response));
        } catch (error) {
            console.error(JSON.stringify({
                success: false,
                error: error.message
            }));
        }
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    process.exit(0);
});

main().catch(console.error);