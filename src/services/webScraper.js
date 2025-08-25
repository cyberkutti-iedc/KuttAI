import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import https from 'https';

class WebScraper {
    constructor() {
        this.scrapedData = new Map();
        this.axiosConfig = {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            // Bypass SSL certificate verification
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        };
        this.allowedDomains = ['ecocee.in', 'ktu.edu.in', 'ktunotes.in'];
    }

    async scrapeWebsite(url) {
        try {
            console.log(`🌐 Accessing: ${url}`);
            
            // Validate URL
            const validUrl = this.validateUrl(url);
            if (!validUrl) {
                throw new Error('Invalid URL format');
            }
            
            // Check if domain is allowed
            let isAllowed = false;
            for (const domain of this.allowedDomains) {
                if (validUrl.includes(domain)) {
                    isAllowed = true;
                    break;
                }
            }
            
            if (!isAllowed) {
                throw new Error('Domain not allowed. Only ecocee.in, ktu.edu.in, and ktunotes.in are permitted.');
            }

            // Fetch the webpage with SSL bypass
            const response = await axios.get(validUrl, this.axiosConfig);
            
            // Parse HTML
            const $ = cheerio.load(response.data);
            
            // Extract content
            const scrapedContent = this.extractContent($, validUrl);
            
            // Store the data
            this.scrapedData.set(validUrl, {
                ...scrapedContent,
                scrapedAt: new Date().toISOString(),
                url: validUrl
            });

            return scrapedContent;

        } catch (error) {
            console.error(`❌ Failed to access ${url}:`, error.message);
            
            // Provide more helpful error messages
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Connection refused. The website may be down or blocking requests.');
            } else if (error.code === 'ETIMEDOUT') {
                throw new Error('Connection timed out. The website may be slow or unavailable.');
            } else if (error.response) {
                throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
            }
            
            throw error;
        }
    }

    validateUrl(url) {
        try {
            // Add protocol if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            const parsedUrl = new URL(url);
            return parsedUrl.href;
        } catch (error) {
            return null;
        }
    }

    extractContent($, url) {
        // Remove unwanted elements
        $('script, style, nav, footer, header, aside').remove();
        
        // Extract title
        const title = $('title').text().trim() || 
                     $('h1').first().text().trim() || 
                     'Untitled Page';

        // Extract meta description
        const description = $('meta[name="description"]').attr('content') || 
                           $('meta[property="og:description"]').attr('content') || 
                           $('p').first().text().trim().slice(0, 200) || 
                           'No description available';

        // Extract main content - simplified for educational content
        let content = '';
        
        // Try to find main content areas common to educational sites
        const contentSelectors = [
            'main',
            'article',
            '.content',
            '#content',
            '.post-content',
            '.entry-content',
            '.main-content',
            '.page-content',
            'body'
        ];

        for (const selector of contentSelectors) {
            const element = $(selector);
            if (element.length > 0) {
                content = this.cleanText(element.text());
                if (content.length > 300) break; // We have enough content
            }
        }

        // Extract headings
        const headings = [];
        $('h1, h2, h3').each((_, element) => {
            const heading = $(element).text().trim();
            if (heading) {
                headings.push({
                    level: element.tagName.toLowerCase(),
                    text: heading
                });
            }
        });

        return {
            title,
            description,
            content: content.slice(0, 3000), // Limit content length
            headings: headings.slice(0, 10), // Limit headings
            wordCount: content.split(' ').length
        };
    }

    cleanText(text) {
        return text
            .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
            .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
            .trim();
    }

    getScrapedData(url = null) {
        if (url) {
            const validUrl = this.validateUrl(url);
            return this.scrapedData.get(validUrl) || null;
        }
        return Array.from(this.scrapedData.values());
    }

    getContextForQuery(query) {
        const websites = Array.from(this.scrapedData.values());
        if (websites.length === 0) return null;

        // Simple keyword matching to find relevant scraped content
        const queryWords = query.toLowerCase().split(' ');
        const relevantContent = [];

        websites.forEach(site => {
            const siteContent = `${site.title} ${site.description} ${site.content}`.toLowerCase();
            const relevanceScore = queryWords.reduce((score, word) => {
                return score + (siteContent.includes(word) ? 1 : 0);
            }, 0);

            if (relevanceScore > 0) {
                relevantContent.push({
                    ...site,
                    relevanceScore
                });
            }
        });

        if (relevantContent.length === 0) return null;

        // Sort by relevance and return top content
        relevantContent.sort((a, b) => b.relevanceScore - a.relevanceScore);
        const topContent = relevantContent.slice(0, 2); // Top 2 most relevant

        return topContent.map(site => 
            `Source: ${site.url}\nTitle: ${site.title}\nContent: ${site.content.slice(0, 500)}...`
        ).join('\n\n');
    }
    
    // Method to try multiple URLs for the same site
    async tryMultiplePaths(baseUrl, paths = ['', '/home', '/index', '/main']) {
        for (const path of paths) {
            try {
                const url = `${baseUrl}${path}`;
                console.log(`Trying: ${url}`);
                const result = await this.scrapeWebsite(url);
                return result;
            } catch (error) {
                console.log(`Failed to access ${baseUrl}${path}: ${error.message}`);
                // Continue to next path
            }
        }
        throw new Error(`Could not access any paths for ${baseUrl}`);
    }
}

export default WebScraper;