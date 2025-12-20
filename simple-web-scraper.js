const https = require('https');
const http = require('http');
const { URL } = require('url');

// Simple web scraper without external dependencies
class SimpleWebScraper {
    async fetchPage(url) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };

            const req = client.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({
                            status: res.statusCode,
                            headers: res.headers,
                            content: data
                        });
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    extractTitle(html) {
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        return titleMatch ? titleMatch[1].trim() : '';
    }

    extractMetaDescription(html) {
        const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
        return descMatch ? descMatch[1] : '';
    }

    extractText(html) {
        // Remove script and style tags and their content
        let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // Remove HTML comments
        text = text.replace(/<!--[\s\S]*?-->/g, '');

        // Remove all HTML tags
        text = text.replace(/<[^>]+>/g, '');

        // Normalize whitespace
        text = text.replace(/\s+/g, ' ');
        text = text.replace(/\n\s*\n/g, '\n');

        return text.trim();
    }

    async scrape(url) {
        try {
            const response = await this.fetchPage(url);
            const html = response.content;

            return {
                url,
                title: this.extractTitle(html),
                description: this.extractMetaDescription(html),
                textContent: this.extractText(html),
                htmlContent: html,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw error;
        }
    }
}

// Export for use
module.exports = SimpleWebScraper;

// If run directly
if (require.main === module) {
    const scraper = new SimpleWebScraper();
    const url = process.argv[2];

    if (!url) {
        console.error('Usage: node simple-web-scraper.js <url>');
        process.exit(1);
    }

    scraper.scrape(url)
        .then(result => {
            console.log(JSON.stringify(result, null, 2));
        })
        .catch(error => {
            console.error('Error:', error.message);
            process.exit(1);
        });
}