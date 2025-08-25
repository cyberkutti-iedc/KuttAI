import { getLlama, LlamaChatSession } from "node-llama-cpp";
import readline from "readline";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import WebScraper from './services/webScraper.js';
import CommandHandler from './handlers/commandHandler.js';
import UIHelper from './utils/uiHelper.js';
import os from 'os';
import { spawn, execSync } from 'child_process';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CLIChatbot {
    constructor() {
        this.llama = null;
        this.model = null;
        this.context = null;
        this.session = null;
        this.rl = null;
        
        // Determine platform-specific model directory
        this.modelsDir = this.getModelsDirectory();
        
        // Initialize services
        this.webScraper = new WebScraper();
        this.commandHandler = new CommandHandler(this.webScraper);
        this.uiHelper = new UIHelper();
        this.userData = this.loadUserData();
        
        // Find model file
        this.modelPath = this.findModelFile();
        
        // Default model URL (user can change this)
        this.modelUrl = "https://huggingface.co/mradermacher/ClinIQ-Gemma-2B-v0-hf-GGUF/resolve/main/hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf";
       // this.modelUrl = "https://huggingface.co/mradermacher/ClinIQ-Gemma-2B-v0-hf-GGUF/blob/main/hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf";
    }

    getModelsDirectory() {
        const homeDir = os.homedir();
        const platform = os.platform();
        
        if (platform === 'win32') {
            return path.join(homeDir, 'AppData', 'Local', 'KuttAI', 'models');
        } else if (platform === 'darwin') {
            return path.join(homeDir, 'Library', 'Application Support', 'KuttAI', 'models');
        } else {
            // Linux and other Unix-like systems
            return path.join(homeDir, '.kuttai', 'models');
        }
    }

    findModelFile() {
        // Ensure models directory exists
        if (!fs.existsSync(this.modelsDir)) {
            fs.mkdirSync(this.modelsDir, { recursive: true });
            return null;
        }
        
        // Look for .gguf files
        const files = fs.readdirSync(this.modelsDir);
        const ggufFiles = files.filter(file => file.endsWith('.gguf'));
        
        if (ggufFiles.length === 0) {
            return null;
        }
        
        // Prioritize the specified model if available
        const preferredModel = ggufFiles.find(file => 
            file.includes('ClinIQ-Gemma-2B') || file.includes('hf_mradermacher')
        );
        
        return preferredModel ? path.join(this.modelsDir, preferredModel) : 
                               path.join(this.modelsDir, ggufFiles[0]);
    }

    checkInternetConnection() {
        return new Promise((resolve) => {
            const req = https.request({
                hostname: 'www.google.com',
                port: 443,
                path: '/',
                method: 'HEAD',
                timeout: 5000
            }, (res) => {
                resolve(res.statusCode === 200);
            });
            
            req.on('error', () => {
                resolve(false);
            });
            
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });
            
            req.end();
        });
    }

    checkNodeInstallation() {
        try {
            execSync('node --version', { stdio: 'pipe' });
            return true;
        } catch (error) {
            return false;
        }
    }

    async downloadModelWithNpx() {
        console.log("\n📦 Downloading model using npx command...");
        
        try {
            const loadingInterval = this.uiHelper.showLoadingAnimation("Downloading with npx");
            
            // Use the correct URL format for npx command
            const npxModelUrl = "https://huggingface.co/mradermacher/ClinIQ-Gemma-2B-v0-hf-GGUF/resolve/main/hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf";
            
            const command = `npx`;
            const args = [
                '--no',
                'node-llama-cpp',
                'pull',
                '--dir',
                this.modelsDir,
                npxModelUrl
            ];
            
            const child = spawn(command, args, {
                stdio: 'pipe',
                shell: true
            });
            
            let stdout = '';
            let stderr = '';
            
            child.stdout.on('data', (data) => {
                stdout += data.toString();
                // Parse progress from stdout if possible
                const progressMatch = stdout.match(/(\d+)%/);
                if (progressMatch) {
                    this.uiHelper.updateLoadingAnimation(`Downloading: ${progressMatch[1]}%`);
                }
            });
            
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            
            return new Promise((resolve, reject) => {
                child.on('close', (code) => {
                    this.uiHelper.clearLoadingAnimation();
                    
                    if (code === 0) {
                        console.log("✅ Model downloaded successfully using npx!");
                        resolve(true);
                    } else {
                        console.error(`❌ npx command failed with code ${code}`);
                        console.error(`Error: ${stderr}`);
                        
                        // Check if it's a 404 error
                        if (stderr.includes('404') || stderr.includes('Not Found')) {
                            console.log("\n⚠️  Model URL not found. Trying alternative download methods...");
                            resolve(false); // Don't reject, let fallback handle it
                        } else {
                            reject(new Error(`npx command failed: ${stderr}`));
                        }
                    }
                });
                
                child.on('error', (error) => {
                    this.uiHelper.clearLoadingAnimation();
                    console.error("❌ Failed to execute npx command:", error.message);
                    reject(error);
                });
            });
            
        } catch (error) {
            this.uiHelper.clearLoadingAnimation();
            throw error;
        }
    }

    // Add a new method for direct HTTP download as fallback
    async downloadModelDirect() {
        console.log("\n📦 Downloading model directly...");
        
        try {
            const loadingInterval = this.uiHelper.showLoadingAnimation("Downloading model");
            
            const modelFilename = "hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf";
            const filePath = path.join(this.modelsDir, modelFilename);
            const file = fs.createWriteStream(filePath);
            
            // Try multiple possible URL formats
            const possibleUrls = [
                "https://huggingface.co/mradermacher/ClinIQ-Gemma-2B-v0-hf-GGUF/resolve/main/hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf",
                "https://huggingface.co/mradermacher/ClinIQ-Gemma-2B-v0-hf-GGUF/blob/main/hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf",
                "https://huggingface.co/mradermacher/ClinIQ-Gemma-2B-v0-hf-GGUF/raw/main/hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf"
            ];
            
            let success = false;
            let lastError = null;
            
            for (const downloadUrl of possibleUrls) {
                try {
                    console.log(`\n🔄 Trying URL: ${downloadUrl}`);
                    
                    const response = await new Promise((resolve, reject) => {
                        const req = https.get(downloadUrl, (res) => {
                            if (res.statusCode === 200) {
                                let downloaded = 0;
                                const totalSize = parseInt(res.headers['content-length'], 10);
                                
                                res.on('data', (chunk) => {
                                    downloaded += chunk.length;
                                    const percent = Math.round((downloaded / totalSize) * 100);
                                    this.uiHelper.updateLoadingAnimation(`Downloading: ${percent}%`);
                                });
                                
                                res.pipe(file);
                                
                                res.on('end', () => {
                                    file.close();
                                    resolve(true);
                                });
                            } else {
                                reject(new Error(`HTTP ${res.statusCode}`));
                            }
                        });
                        
                        req.on('error', reject);
                        req.setTimeout(30000, () => {
                            req.destroy();
                            reject(new Error('Timeout'));
                        });
                    });
                    
                    success = true;
                    break;
                    
                } catch (error) {
                    lastError = error;
                    console.log(`❌ Failed with URL: ${downloadUrl} (${error.message})`);
                    
                    // Clean up partial download
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
            
            this.uiHelper.clearLoadingAnimation();
            
            if (success) {
                console.log("✅ Model downloaded successfully!");
                this.modelPath = path.join(this.modelsDir, modelFilename);
                return true;
            } else {
                throw new Error(`All download URLs failed: ${lastError?.message}`);
            }
            
        } catch (error) {
            this.uiHelper.clearLoadingAnimation();
            throw error;
        }
    }

    // Update the downloadModelWithFallback method
    async downloadModelWithFallback() {
        console.log("\n📦 Model not found. Downloading required model...");
        
        // First check internet connection
        const hasInternet = await this.checkInternetConnection();
        if (!hasInternet) {
            throw new Error("No internet connection available. Please connect to the internet and try again.");
        }
        
        // Check if Node.js is properly installed
        const hasNode = this.checkNodeInstallation();
        if (!hasNode) {
            throw new Error("Node.js is not properly installed. Please install Node.js and try again.");
        }
        
        try {
            // Try using npx method first
            const npxSuccess = await this.downloadModelWithNpx();
            if (npxSuccess) return true;
            
            // If npx failed but didn't reject, try direct download
            console.log("🔄 Trying direct HTTP download...");
            return await this.downloadModelDirect();
            
        } catch (error) {
            this.uiHelper.clearLoadingAnimation();
            console.error("❌ All download methods failed:", error.message);
            
            // Provide detailed instructions for manual download
            console.log("\n💡 Manual download instructions:");
            console.log("1. Visit: https://huggingface.co/mradermacher/ClinIQ-Gemma-2B-v0-hf-GGUF");
            console.log("2. Look for the model file (usually .gguf format)");
            console.log("3. Download it and save to:");
            console.log(`   ${this.modelsDir}`);
            console.log("4. Restart KuttAI");
            
            throw new Error("Could not download model automatically. Please download manually.");
        }
    }

    async checkModelAvailability() {
        if (!this.modelPath) {
            console.log("❌ No model file found.");
            
            // Try to download the model
            const success = await this.downloadModelWithFallback();
            if (!success) {
                throw new Error("Model not available and could not be downloaded");
            }
            
            // Update model path after download
            this.modelPath = path.join(this.modelsDir, "hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf");
        }
        
        // Check if model file exists
        if (!fs.existsSync(this.modelPath)) {
            console.log(`❌ Model file not found at: ${this.modelPath}`);
            
            // Try to download the model
            const success = await this.downloadModelWithFallback();
            if (!success) {
                throw new Error("Model not available and could not be downloaded");
            }
        }
        
        console.log(`✅ Using model: ${path.basename(this.modelPath)}`);
        return true;
    }

    async initialize() {
        this.uiHelper.showLoadingAnimation("Initializing KuttAI");
        
        // Check model availability
        try {
            await this.checkModelAvailability();
        } catch (error) {
            this.uiHelper.clearLoadingAnimation();
            console.error(`\n❌ ${error.message}`);
            console.log("\n💡 Solutions:");
            console.log("1. Check your internet connection");
            console.log("2. Make sure Node.js is properly installed");
            console.log("3. Manually download a model and place it in:");
            console.log(`   ${this.modelsDir}`);
            console.log("4. Supported models: GGUF format from Hugging Face");
            
            // Offer to open the download URL
            console.log("\n🌐 Would you like to open the model download page in your browser? (y/n)");
            
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            rl.question('> ', (answer) => {
                if (answer.toLowerCase().startsWith('y')) {
                    try {
                        import('open').then(open => {
                            open.default(this.modelUrl);
                            console.log("Opening download page...");
                        });
                    } catch (error) {
                        console.log("Please visit:", this.modelUrl);
                    }
                }
                rl.close();
                process.exit(1);
            });
            
            return;
        }

        try {
            // Initialize llama instance first
            this.uiHelper.updateLoadingAnimation("Loading AI engine");
            this.llama = await getLlama();

            // Load the model
            this.uiHelper.updateLoadingAnimation("Loading knowledge base");
            this.model = await this.llama.loadModel({
                modelPath: this.modelPath,
                gpuLayers: "auto",
            });

            // Create context
            this.uiHelper.updateLoadingAnimation("Setting up context");
            this.context = await this.model.createContext({
                contextSize: 4096,
            });

            // Create chat session
            this.uiHelper.updateLoadingAnimation("Almost ready");
            this.session = new LlamaChatSession({
                contextSequence: this.context.getSequence(),
                systemPrompt: this.getSystemPrompt()
            });

            this.uiHelper.clearLoadingAnimation();
            console.log("\n✅ KuttAI initialized successfully!");
            this.uiHelper.displayCommands();

        } catch (error) {
            this.uiHelper.clearLoadingAnimation();
            console.error("❌ Failed to initialize KuttAI:", error.message);
            
            this.uiHelper.displayTroubleshootingTips();
            process.exit(1);
        }
    }

    getSystemPrompt() {
        return `IMPORTANT: You are KuttAI, a helpful assistant for KTU students developed by EcoCee. 
Your name is KuttAI. Never say your name is Gemma or anything else.

You can access information from KTU-related websites when needed.

Always be friendly, helpful, and focused on assisting with studies, exams, and university matters.

Key information about the user:
- Name: ${this.userData.name || 'Not provided'}
- Semester: ${this.userData.semester || 'Not provided'}
- Branch: ${this.userData.branch || 'Not provided'}
- Interests: ${this.userData.interests || 'Not provided'}

Available commands:
- /profile - View and edit your profile
- /sites - List available KTU websites
- /clear - Clear chat history
- /help - Show available commands
- Regular chat - Ask questions about studies, exams, etc.

Focus on providing accurate and helpful information for KTU students.
Always identify yourself as KuttAI, developed by EcoCee.`;
    }

    setupReadline() {
        // Fixed readline implementation without double characters
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: ""
        });

        // Store current input
        this.currentInput = '';
        
        // Handle line input (when user presses Enter)
        this.rl.on('line', (input) => {
            this.processInput(input);
        });

        // Handle Ctrl+C
        this.rl.on('SIGINT', () => {
            console.log("\n👋 Goodbye! See you soon, KTUian!");
            this.cleanup();
        });

        // Custom prompt that doesn't interfere with input
        this.rl.setPrompt(this.uiHelper.gradientText('❯ ', 
            [this.uiHelper.colors.gradientBlue, this.uiHelper.colors.gradientRed, 
             this.uiHelper.colors.gradientYellow, this.uiHelper.colors.gradientGreen]));
        
        this.rl.prompt();
    }

    processInput(input) {
        const userMessage = input.trim();
        
        // Check for exit commands
        if (this.isExitCommand(userMessage)) {
            this.cleanup();
            return;
        }

        // Handle commands
        if (userMessage.startsWith('/')) {
            this.handleCommand(userMessage);
            return;
        }

        // Handle regular chat
        this.handleChatMessage(userMessage);
    }

    isExitCommand(message) {
        const exitCommands = ['exit', 'quit', '/exit', '/quit'];
        return exitCommands.includes(message.toLowerCase());
    }

    async handleCommand(command) {
        try {
            await this.commandHandler.handle(command, this.userData);
            // Save user data after any command that might modify it
            this.saveUserData();
            // Re-display prompt after command execution
            this.rl.prompt();
        } catch (error) {
            console.error("❌ Command error:", error.message);
            this.rl.prompt();
        }
    }

    filterResponse(response, originalMessage) {
        const lowerResponse = response.toLowerCase();
        const lowerMessage = originalMessage.toLowerCase();
        
        // Pattern matching for different question types
        const patterns = {
            // Identity questions
            identity: [
                /who\s+(made|created|developed|built)\s+you/i,
                /who\s+are\s+you/i,
                /what\s+are\s+you/i,
                /what('s| is) your name/i,
                /tell me about yourself/i,
                /introduce yourself/i
            ],
            
            // EcoCee questions
            ecocee: [
                /what is ecocee/i,
                /who is ecocee/i,
                /tell me about ecocee/i,
                /ecocee\.in/i
            ],
            
            // Technology questions
            technology: [
                /what (model|technology) do you use/i,
                /how do you work/i,
                /what are you built on/i,
                /underlying (tech|technology|model)/i
            ]
        };
        
        // Check EcoCee patterns - if asking about EcoCee and internet is available, fetch first
        const isEcoCeeQuestion = patterns.ecocee.some(pattern => pattern.test(originalMessage));
        if (isEcoCeeQuestion) {
            // Try to fetch from ecocee.in if not already scraped
            this.fetchEcoCeeContent();
            response = "EcoCee is the development team that created KuttAI! You can visit them at ecocee.in. They built me using an open-source Gemma model from Google DeepMind and customized it specifically for KTU students to help with studies, exams, and university-related queries.";
        }
        
        // Check identity patterns
        const isIdentityQuestion = patterns.identity.some(pattern => pattern.test(originalMessage));
        if (isIdentityQuestion) {
            if (lowerResponse.includes("google") || lowerResponse.includes("deepmind") || 
                lowerResponse.includes("gemma team") || !lowerResponse.includes("ecocee")) {
                response = "I'm KuttAI, a CLI tool developed by EcoCee (visit ecocee.in) using an open-source Gemma model from Google DeepMind. I'm specifically designed to help KTU students with their academic needs!";
            }
        }
        
        // Check technology patterns
        const isTechnologyQuestion = patterns.technology.some(pattern => pattern.test(originalMessage));
        if (isTechnologyQuestion) {
            response = "I'm powered by an open-source Gemma model from Google DeepMind, but I've been customized and developed by EcoCee (ecocee.in) specifically for KTU students. KuttAI is the interface that makes this technology accessible for your academic needs!";
        }
        
        // Fix any remaining Gemma references in identity contexts
        if ((isIdentityQuestion || lowerMessage.includes("name")) && lowerResponse.includes("gemma")) {
            response = response.replace(/gemma/gi, "KuttAI");
            response = response.replace(/my name is/gi, "I'm");
            
            if (!response.includes("EcoCee") || !response.includes("ecocee.in")) {
                response = response + " I was developed by EcoCee (ecocee.in) using Google's Gemma technology.";
            }
        }
        
        return response;
    }

    // New method to fetch EcoCee content
    async fetchEcoCeeContent() {
        try {
            // Check if we already have EcoCee data
            const existingData = this.webScraper.getScrapedData("https://ecocee.in");
            if (!existingData) {
                console.log("🌐 Fetching latest information from EcoCee...");
                await this.webScraper.scrapeWebsite("https://ecocee.in");
                console.log("✅ EcoCee information updated!");
            }
        } catch (error) {
            // Silently fail - we'll just use the default response
            console.log("⚠️  Could not fetch EcoCee information, using cached data");
        }
    }

    loadUserData() {
        try {
            const dataPath = path.join(this.modelsDir, '../userdata.json');
            if (fs.existsSync(dataPath)) {
                return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            }
        } catch (error) {
            console.log("⚠️  Could not load user data, starting fresh");
        }
        
        return {
            name: "",
            semester: "",
            branch: "",
            interests: "",
            firstTime: true
        };
    }

    saveUserData() {
        try {
            const dataPath = path.join(this.modelsDir, '../userdata.json');
            fs.writeFileSync(dataPath, JSON.stringify(this.userData, null, 2));
        } catch (error) {
            console.log("⚠️  Could not save user data");
        }
    }

    async handleChatMessage(message) {
        const thinkingInterval = this.uiHelper.showThinkingAnimation();

        try {
            // Check if this is about EcoCee and fetch content if needed
            if (message.toLowerCase().includes("ecocee")) {
                await this.fetchEcoCeeContent();
            }

            // Get context from scraped data if available
            const context = this.webScraper.getContextForQuery(message);
            
            let fullMessage = message;
            if (context) {
                fullMessage += `\n\nContext from KTU websites:\n${context}`;
            }

            // Add user profile context
            fullMessage += `\n\nUser profile: ${JSON.stringify(this.userData)}`;

            // Generate response
            let response = await this.session.prompt(fullMessage, {
                temperature: 0.7,
                topP: 0.9,
                maxTokens: 512,
            });

            // Apply response filters to fix known issues
            response = this.filterResponse(response, message);

            // If we have EcoCee content and the question is about EcoCee, enhance the response
            if (message.toLowerCase().includes("ecocee")) {
                const ecoceeData = this.webScraper.getScrapedData("https://ecocee.in");
                if (ecoceeData) {
                    response = this.enhanceWithEcoCeeContent(response, ecoceeData);
                }
            }

            // Clear thinking animation
            clearInterval(thinkingInterval);
            process.stdout.write('\r\x1b[K');

            // Display response with styling
            console.log(`\x1b[35m🤖 KuttAI\x1b[0m: ${response}\n`);

        } catch (error) {
            clearInterval(thinkingInterval);
            process.stdout.write('\r\x1b[K');
            console.error("❌ Error generating response:", error.message);
        } finally {
            // Always re-display prompt after handling message
            this.rl.prompt();
        }
    }

    // Enhance response with actual content from EcoCee website
    enhanceWithEcoCeeContent(response, ecoceeData) {
        // If we have detailed content from EcoCee, use it to enhance the response
        if (ecoceeData && ecoceeData.description && ecoceeData.description.length > 50) {
            return `EcoCee is the development team behind KuttAI! Based on their website (ecocee.in):\n\n${ecoceeData.description}\n\nThey built me using an open-source Gemma model and customized it for KTU students.`;
        }
        return response;
    }

    async cleanup() {
        if (this.rl) {
            this.rl.close();
        }
        
        console.log("🔄 Saving your data...");
        this.saveUserData();
        
        try {
            if (this.session) {
                await this.session.dispose?.();
            }
            if (this.context) {
                await this.context.dispose();
            }
            if (this.model) {
                await this.model.dispose();
            }
            if (this.llama) {
                await this.llama.dispose?.();
            }
        } catch (error) {
            console.log("⚠️  Cleanup warning:", error.message);
        }
        
        console.log("✅ Cleanup complete. Goodbye!");
        process.exit(0);
    }

    async start() {
        this.uiHelper.displayWelcome();
        
        // First time setup
        if (this.userData.firstTime) {
            await this.setupUserProfile();
            this.userData.firstTime = false;
            this.saveUserData();
        }
        
        await this.initialize();
        this.setupReadline();
    }

    async setupUserProfile() {
        console.log("\n📝 Let's set up your KuttAI profile!");
        
        const askQuestion = (query) => {
            return new Promise((resolve) => {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl.question(query, (answer) => {
                    rl.close();
                    resolve(answer.trim());
                });
            });
        };
        
        this.userData.name = await askQuestion("What's your name? ");
        this.userData.semester = await askQuestion("Which semester are you in? ");
        this.userData.branch = await askQuestion("What's your branch? ");
        this.userData.interests = await askQuestion("What are your academic interests? ");
        
        console.log("✅ Profile setup complete!\n");
    }
}

export default CLIChatbot;