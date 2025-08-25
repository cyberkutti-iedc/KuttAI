import readline from 'readline';

class CommandHandler {
    constructor(webScraper) {
        this.webScraper = webScraper;
        this.commands = {
            '/profile': this.handleProfile.bind(this),
            '/sites': this.handleSites.bind(this),
            '/clear': this.handleClear.bind(this),
            '/help': this.handleHelp.bind(this),
            '/fetch': this.handleFetch.bind(this),
            '/about': this.handleAbout.bind(this)
        };
        
        this.allowedDomains = ['ecocee.in', 'ktu.edu.in', 'ktunotes.in'];
        this.alternativePaths = {
            'ktu.edu.in': ['', '/home', '/index.php', '/eu/index.php', '/notifications']
        };
    }

    async handle(commandLine, userData) {
        const parts = commandLine.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands[command]) {
            await this.commands[command](args, userData);
        } else {
            console.log(`❌ Unknown command: ${command}`);
            this.handleHelp([]);
        }
    }

    async handleProfile(args, userData) {
        if (args.length === 0) {
            console.log("\n📋 Your KuttAI Profile:");
            console.log(`   Name: ${userData.name || 'Not set'}`);
            console.log(`   Semester: ${userData.semester || 'Not set'}`);
            console.log(`   Branch: ${userData.branch || 'Not set'}`);
            console.log(`   Interests: ${userData.interests || 'Not set'}`);
            console.log("\nUse /profile edit to update your information");
            return;
        }
        
        if (args[0] === 'edit') {
            console.log("\n📝 Edit your profile (press enter to keep current value):");
            
            const askQuestion = (query, current) => {
                return new Promise((resolve) => {
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    rl.question(`${query} [${current}]: `, (answer) => {
                        rl.close();
                        resolve(answer.trim() || current);
                    });
                });
            };
            
            userData.name = await askQuestion("Name", userData.name);
            userData.semester = await askQuestion("Semester", userData.semester);
            userData.branch = await askQuestion("Branch", userData.branch);
            userData.interests = await askQuestion("Interests", userData.interests);
            
            console.log("✅ Profile updated successfully!");
        } else {
            console.log("❌ Unknown profile command. Use /profile or /profile edit");
        }
    }

    async handleSites(args, userData) {
        console.log("\n🌐 Available KTU Websites:");
        console.log("   • https://ecocee.in - EcoCee Development");
        console.log("   • https://ktu.edu.in - KTU Official Website");
        console.log("   • https://ktunotes.in - KTU Notes & Materials");
        console.log("\nKuttAI can fetch information from these sites when needed.");
    }

    async handleClear(args, userData) {
        console.log("🗑️  Chat history cleared. Your profile data remains intact.");
        // In a real implementation, this would clear the chat history
    }

    async handleHelp(args, userData) {
        console.log("\n🤖 KuttAI Commands:");
        console.log("  /profile       - View and edit your profile");
        console.log("  /sites         - List available KTU websites");
        console.log("  /clear         - Clear chat history");
        console.log("  /fetch <url>   - Get information from KTU website");
        console.log("  /about         - Learn about KuttAI");
        console.log("  /help          - Show this help message");
        console.log("  exit/quit      - Exit the chatbot");
        console.log();
        console.log("💬 Chat Examples:");
        console.log("  'What are the upcoming exam dates?'");
        console.log("  'Tell me about S6 CSE syllabus'");
        console.log("  'How to calculate SGPA?'");
        console.log("  'Recent notifications from KTU'");
        console.log();
    }

    async handleFetch(args, userData) {
        if (args.length === 0) {
            console.log("❌ Please provide a URL to fetch.");
            console.log("Usage: /fetch <URL>");
            console.log("Example: /fetch https://ktu.edu.in");
            return;
        }

        const url = args[0];
        
        // Validate URL is from allowed domains
        let isValid = false;
        let domain = '';
        for (const allowedDomain of this.allowedDomains) {
            if (url.includes(allowedDomain)) {
                isValid = true;
                domain = allowedDomain;
                break;
            }
        }
        
        if (!isValid) {
            console.log("❌ Sorry, I can only fetch from ecocee.in, ktu.edu.in, and ktunotes.in");
            return;
        }
        
        try {
            const loadingInterval = this.showLoadingAnimation('Fetching information');
            
            let result;
            // Try alternative paths for known problematic sites
            if (domain === 'ktu.edu.in' && this.alternativePaths[domain]) {
                const baseUrl = 'https://ktu.edu.in';
                result = await this.webScraper.tryMultiplePaths(baseUrl, this.alternativePaths[domain]);
            } else {
                result = await this.webScraper.scrapeWebsite(url);
            }
            
            clearInterval(loadingInterval);
            process.stdout.write('\r\x1b[K'); // Clear line

            console.log("📄 Information Retrieved:");
            console.log(`   Title: ${result.title}`);
            console.log(`   Source: ${result.url}`);
            console.log(`   Content: ${result.description.slice(0, 150)}${result.description.length > 150 ? '...' : ''}`);
            console.log(`   ✅ Data stored for context\n`);

        } catch (error) {
            console.error(`❌ Failed to fetch: ${error.message}\n`);
            console.log("💡 Tip: Some websites may be temporarily unavailable or block automated access.");
        }
    }

    async handleAbout(args, userData) {
        console.log("\n" + "=".repeat(50));
        console.log("📘 KuttAI - KTU STUDENT ASSISTANT");
        console.log("=".repeat(50));
        console.log("Developed by EcoCee (ecocee.in)");
        console.log("Version: 1.0.0");
        console.log("\nKuttAI helps KTU students with:");
        console.log("• Study materials and notes");
        console.log("• Exam schedules and results");
        console.log("• University notifications");
        console.log("• Academic guidance");
        console.log("• And much more!");
        console.log("\nYour data is stored locally on your machine.");
        console.log("=".repeat(50));
    }

    showLoadingAnimation(message = 'Processing') {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        
        return setInterval(() => {
            process.stdout.write(`\r${frames[i]} ${message}...`);
            i = (i + 1) % frames.length;
        }, 100);
    }
}

export default CommandHandler;