// errorHandler.js
import { execSync } from 'child_process';

export function setupErrorHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('\n❌ Uncaught Exception:', error.message);
        console.error('Stack:', error.stack);
        
        // Check if it's a model loading error
        if (error.message.includes('model') || error.message.includes('download')) {
            console.log('\n💡 Model error detected. Please check:');
            console.log('1. Internet connection');
            console.log('2. Model file exists in models directory');
            console.log('3. File permissions');
        }
        
        // Graceful shutdown
        console.log('\n🔄 Shutting down gracefully...');
        process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        console.error('\n❌ Unhandled Rejection at:', promise);
        console.error('Reason:', reason);
        
        // Graceful shutdown
        console.log('\n🔄 Shutting down gracefully...');
        process.exit(1);
    });

    // Handle SIGTERM (graceful shutdown)
    process.on('SIGTERM', () => {
        console.log('\n📡 Received SIGTERM signal');
        console.log('🔄 Shutting down gracefully...');
        process.exit(0);
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
        console.log('\n👋 Received interrupt signal');
        console.log('🔄 Shutting down gracefully...');
        process.exit(0);
    });
}

export class ChatbotError extends Error {
    constructor(message, type = 'CHATBOT_ERROR') {
        super(message);
        this.name = 'ChatbotError';
        this.type = type;
        this.isOperational = true;
    }
}

export class ModelDownloadError extends Error {
    constructor(message, url, originalError = null) {
        super(message);
        this.name = 'ModelDownloadError';
        this.url = url;
        this.originalError = originalError;
        this.isOperational = true;
    }
}

export class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
        this.isOperational = true;
    }
}

export function handleAsyncError(asyncFn) {
    return async (...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            if (error.isOperational) {
                console.error(`❌ ${error.name}:`, error.message);
            } else {
                console.error(`❌ Unexpected error:`, error.message);
            }
            
            // Add more context for specific error types
            if (error.name === 'NetworkError') {
                console.log('💡 Please check your internet connection and try again.');
            } else if (error.name === 'ModelDownloadError') {
                console.log(`💡 Please download the model manually from: ${error.url}`);
                console.log('And place it in the models directory.');
            }
            
            throw error;
        }
    };
}

// Utility function to check system requirements
export function checkSystemRequirements() {
    try {
        // Check Node.js version
        const nodeVersion = process.versions.node;
        const majorVersion = parseInt(nodeVersion.split('.')[0]);
        
        if (majorVersion < 18) {
            throw new Error(`Node.js version 18 or higher required. Current version: ${nodeVersion}`);
        }
        
        // Check if important dependencies are available
        try {
            execSync('npx --version', { stdio: 'pipe' });
        } catch {
            console.warn('⚠️  npx not available. Some features may not work.');
        }
        
        return true;
    } catch (error) {
        console.error('❌ System requirements check failed:', error.message);
        return false;
    }
}