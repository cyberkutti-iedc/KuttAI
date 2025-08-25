#!/usr/bin/env node

import CLIChatbot from './src/chatbot.js';
import { setupErrorHandlers } from './src/utils/errorHandler.js';

// Setup global error handlers
setupErrorHandlers();

// Start the chatbot
async function main() {
    try {
        const chatbot = new CLIChatbot();
        await chatbot.start();
    } catch (error) {
        console.error("❌ Failed to start KuttAI:", error.message);
        process.exit(1);
    }
}

main();