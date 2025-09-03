import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UIHelper {
    constructor() {
        this.loadingInterval = null;
        this.currentLoadingMessage = "";
        // REMOVED the readline interface creation here
        // The chatbot should handle readline, not UIHelper
        this.colors = {
            gradientBlue: '\x1b[38;2;66;133;244m',
            gradientRed: '\x1b[38;2;234;67;53m',
            gradientYellow: '\x1b[38;2;251;188;5m',
            gradientGreen: '\x1b[38;2;52;168;83m',
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            cyan: '\x1b[36m',
            magenta: '\x1b[35m',
            blue: '\x1b[34m',
            yellow: '\x1b[33m',
            green: '\x1b[32m',
            red: '\x1b[31m',
            white: '\x1b[37m'
        };
    }

    // Create gradient text effect
    gradientText(text, colors) {
        let result = '';
        const colorCount = colors.length;
        const segmentLength = Math.max(1, Math.floor(text.length / colorCount));
        
        for (let i = 0; i < text.length; i++) {
            const colorIndex = Math.min(colorCount - 1, Math.floor(i / segmentLength));
            result += colors[colorIndex] + text[i];
        }
        
        return result + this.colors.reset;
    }

    // Display the welcome banner with KuttAI branding
    displayWelcome() {
        console.clear();
        

        const banner = [
    "╔══════════════════════════════════════════════════════════════╗",
    "║                                                              ║",
    "║    ██╗  ██╗██╗   ██╗████████╗████████╗ █████╗ ██╗            ║",
    "║    ██║ ██╔╝██║   ██║╚══██╔══╝╚══██╔══╝██╔══██╗██║            ║",
    "║    █████╔╝ ██║   ██║   ██║      ██║   ███████║██║            ║",
    "║    ██╔═██╗ ██║   ██║   ██║      ██║   ██╔══██║██║            ║",
    "║    ██║  ██╗╚██████╔╝   ██║      ██║   ██║  ██║██║            ║",
    "║    ╚═╝  ╚═╝ ╚═════╝    ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝            ║",
    "║                                                              ║",
    "║                (っᵔ◡ᵔ)っ  K U T T   A I                      ║",
    "║                                                              ║",
    "╚══════════════════════════════════════════════════════════════╝"
];
        

        // Apply gradients to different parts of the banner
        console.log(this.gradientText(banner[0], [this.colors.gradientBlue, this.colors.gradientRed]));
        console.log(this.gradientText(banner[1], [this.colors.gradientYellow, this.colors.gradientGreen]));
        console.log(this.gradientText(banner[2], [this.colors.gradientBlue, this.colors.gradientRed]));
        console.log(this.gradientText(banner[3], [this.colors.gradientYellow, this.colors.gradientGreen]));
        console.log(this.gradientText(banner[4], [this.colors.gradientBlue, this.colors.gradientRed]));
        console.log(this.gradientText(banner[5], [this.colors.gradientYellow, this.colors.gradientGreen]));
        console.log(this.gradientText(banner[6], [this.colors.gradientBlue, this.colors.gradientRed]));
        console.log(this.gradientText(banner[7], [this.colors.gradientYellow, this.colors.gradientGreen]));
        console.log(this.gradientText(banner[8], [this.colors.gradientBlue, this.colors.gradientRed]));
        console.log(this.gradientText(banner[9], [this.colors.gradientYellow, this.colors.gradientGreen]));
        console.log(this.gradientText(banner[10], [this.colors.gradientBlue, this.colors.gradientRed]));
        console.log(this.gradientText(banner[11], [this.colors.gradientYellow, this.colors.gradientGreen]));
        
        // Welcome text with gradient
        const welcomeText = "Welcome to KuttAI - Your smart study companion for KTU!";
        console.log("\n" + this.gradientText(welcomeText, 
            [this.colors.gradientBlue, this.colors.gradientRed, this.colors.gradientYellow, this.colors.gradientGreen]));
        
        console.log(`\n${this.colors.dim}Developed by EcoCee • https://ecocee.in${this.colors.reset}`);
        console.log(`${this.colors.dim}Your data is stored locally on your machine${this.colors.reset}\n`);
    }

    displaySystemInfo(modelPath) {
        console.log(this.gradientText("📊 System Information:", 
            [this.colors.gradientBlue, this.colors.gradientRed]));
        console.log(`   ${this.colors.dim}Node.js: ${process.version}${this.colors.reset}`);
        console.log(`   ${this.colors.dim}Platform: ${process.platform} ${process.arch}${this.colors.reset}`);
        console.log(`   ${this.colors.dim}Model: ${path.basename(modelPath)}${this.colors.reset}`);
        console.log();
    }

    displayCommands() {
        console.log(this.gradientText("(๑•᎑•๑) Getting Started:", 
            [this.colors.gradientYellow, this.colors.gradientGreen]));
        console.log(`   ${this.colors.green}Type your question${this.colors.reset} - Ask about studies, exams, KTU`);
        console.log(`   ${this.colors.green}/profile${this.colors.reset} - Set up your student profile`);
        console.log(`   ${this.colors.green}/help${this.colors.reset} - See all commands`);
        console.log(`   ${this.colors.green}/about${this.colors.reset} - Learn about KuttAI`);
        console.log();
    }

    displayTroubleshootingTips() {
        console.log(`\n${this.gradientText("(´⊙ω⊙`)ᵒ Troubleshooting tips:", 
            [this.colors.gradientRed, this.colors.gradientYellow])}`);
        console.log("1. Make sure you have the latest version of node-llama-cpp:");
        console.log(`   ${this.colors.dim}npm install node-llama-cpp@latest${this.colors.reset}`);
        console.log("2. Check if your system supports the required native bindings");
        console.log("3. Ensure Node.js version is 18 or higher");
        console.log("4. Make sure the model file is not corrupted");
    }

    showLoadingAnimation(message = "Initializing") {
        this.currentLoadingMessage = message;
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        
        this.loadingInterval = setInterval(() => {
            const gradientFrame = this.gradientText(frames[i], 
                [this.colors.gradientBlue, this.colors.gradientRed, this.colors.gradientYellow, this.colors.gradientGreen]);
            // Use process.stderr to avoid interfering with stdout content
            process.stderr.write(`\r${gradientFrame} ${this.colors.cyan}${message}...${this.colors.reset}`);
            i = (i + 1) % frames.length;
        }, 100);
        
        return this.loadingInterval;
    }
    
    updateLoadingAnimation(message) {
        this.currentLoadingMessage = message;
    }
    
    clearLoadingAnimation() {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
            // Clear the line in stderr
            process.stderr.write('\r\x1b[K');
        }
    }

    // Add this new method to your UIHelper class in uiHelper.js
// Insert this method after the existing showThinkingAnimation method

showTypingAnimation(message = "KuttAI is typing") {
    const frames = ['⌨️ ', '✍️ ', '💭 ', '🤖 '];
    const dots = ['', '.', '..', '...'];
    let i = 0;
    let j = 0;
    
    const interval = setInterval(() => {
        const gradientFrame = this.gradientText(frames[i], 
            [this.colors.gradientBlue, this.colors.gradientRed]);
        const gradientDots = this.gradientText(dots[j], 
            [this.colors.gradientYellow, this.colors.gradientGreen]);
        process.stdout.write(`\r${gradientFrame} ${this.colors.magenta}${message}${gradientDots}${this.colors.reset}`);
        
        i = (i + 1) % frames.length;
        if (i === 0) {
            j = (j + 1) % dots.length;
        }
    }, 200); // Slower animation for typing effect
    
    return interval;
}

    showThinkingAnimation(message = "KuttAI is thinking") {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        
        const interval = setInterval(() => {
            const gradientFrame = this.gradientText(frames[i], 
                [this.colors.gradientBlue, this.colors.gradientRed, this.colors.gradientYellow, this.colors.gradientGreen]);
            process.stderr.write(`\r${gradientFrame} ${this.colors.magenta}${message}...${this.colors.reset}`);
            i = (i + 1) % frames.length;
        }, 100);
        
        return interval;
    }

    showProgress(message, current, total) {
        const percentage = Math.floor((current / total) * 100);
        const progressBarLength = 20;
        const completedLength = Math.floor(percentage / 5);
        
        let progressBar = '';
        for (let i = 0; i < progressBarLength; i++) {
            if (i < completedLength) {
                progressBar += this.gradientText('█', 
                    [this.colors.gradientBlue, this.colors.gradientRed, this.colors.gradientYellow, this.colors.gradientGreen]);
            } else {
                progressBar += `${this.colors.dim}░${this.colors.reset}`;
            }
        }
        
        process.stderr.write(`\r${message} [${progressBar}] ${percentage}%`);
        
        if (current === total) {
            process.stderr.write('\n');
        }
    }

    formatFileSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    displayResponseWithContext(response, hasContext) {
        if (hasContext) {
            console.log(this.gradientText("☄ Response includes information from KTU websites\n", 
                [this.colors.gradientGreen, this.colors.gradientBlue]));
        }
        
        // Display AI response with gradient name
        const aiName = this.gradientText("KuttAI", 
            [this.colors.gradientBlue, this.colors.gradientRed]);
        console.log(`(╯'□')╯ ${aiName}: ${response}\n`);
    }

    clearLine() {
        process.stdout.write('\r\x1b[K');
    }

    // REMOVED promptUser method - this should be handled by the chatbot

    // Display success message
    showSuccess(message) {
        console.log(`✅ ${this.gradientText(message, 
            [this.colors.gradientGreen, this.colors.gradientYellow])}`);
    }

    // Display error message
    showError(message) {
        console.log(`❌ ${this.gradientText(message, 
            [this.colors.gradientRed, this.colors.gradientYellow])}`);
    }

    // REMOVED close method - this should be handled by the chatbot
}

export default UIHelper;