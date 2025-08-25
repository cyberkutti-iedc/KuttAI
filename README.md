# KuttAI CLI - Your Intelligent Study Companion

![KuttAI Banner](https://img.shields.io/badge/KuttAI-Revolutionizing%20Student%20Learning-blue?style=for-the-badge&logo=ai)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=for-the-badge)

<div align="center">
  <img src="/public/demo.png" alt="KuttAI CLI Demo" width="800"/>
  
  [![Demo](https://img.shields.io/badge/Watch-Demo-red?style=for-the-badge&logo=youtube)](https://youtube.com)
  [![Download](https://img.shields.io/badge/Download-Latest-blue?style=for-the-badge&logo=github)](https://github.com/cyberkutti-iedc/kuttai/releases)
</div>

## 🌟 Overview

KuttAI is a beautiful, modern command-line interface AI chatbot designed specifically for KTU students. With its stunning gradient-colored interface and powerful AI capabilities, KuttAI provides intelligent assistance for studies, exams, and all things related to the KTU ecosystem.

<div align="center">
  <img src="/public/features.png" alt="Smart KTU Assistant" width="600"/>
</div>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Beautiful UI** | Gradient-colored interface with modern design |
| ⚡ **Real-time Responses** | Fast AI-powered answers to academic questions |
| 📚 **KTU-Focused** | Specialized knowledge for KTU curriculum |
| 🔒 **Privacy First** | All data stored locally on your machine |
| 🎯 **Smart Context** | Understands context from previous conversations |
| 📊 **System Integration** | Displays relevant system information |


## 🚀 Quick Start

### Method 1: Direct Run with npx (Recommended)
```bash
npx kuttai
```

### Method 2: Manual Installation
```bash
# Clone the repository
git clone https://github.com/cyberkutti-iedc/kuttai.git

# Navigate to the project directory
cd kuttai

# Install dependencies
npm install

# Download the AI model (Required before first use)
npx --no node-llama-cpp pull --dir ./models <model-file-url>

# Start KuttAI
npm start
```


## ⚙️ System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 8 GB | 16 GB or more |
| **GPU** | Not required | NVIDIA GPU with 4GB+ VRAM |
| **Storage** | 10 GB free space | 20 GB free space |
| **Node.js** | v18.0.0+ | v20.0.0+ |
| **OS** | Windows 10+, macOS 10.14+, Ubuntu 18.04+ | Latest OS version |

<div align="center">
  <img src="https://via.placeholder.com/600x200/00838f/ffffff?text=System+Requirements" alt="System Requirements" width="600"/>
</div>

## 🎮 Usage Guide

### Starting KuttAI
```bash
# After installation
npm start

# Or directly with node
node index.js
```

### Basic Commands
| Command | Description | Example |
|---------|-------------|---------|
| Just type your question | Get answers about studies, exams, or KTU | `What are the important topics for CS2040?` |
| `/profile` | Set up your student profile | `/profile set semester=4 department=CSE` |
| `/help` | See all available commands | `/help` |
| `/about` | Learn more about KuttAI | `/about` |
| `Ctrl+C` | Exit the application | - |

### Example Interaction
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              KuttAI CLI v1.0.0                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ You: What are the important topics for CS2040?                               │
│                                                                              │
│ KuttAI: Based on the current syllabus, the important topics for CS2040       │
│ include Data Structures, Algorithms, Trees, Graphs, and Sorting Algorithms.  │
│ I recommend focusing on...                                                   │
│                                                                              │
│ You: When is the S4 CSE end semester exam?                                   │
│                                                                              │
│ KuttAI: The S4 CSE end semester exams are scheduled for June 15-30, 2024.    │
│ I suggest starting your preparation at least 6 weeks in advance.             │
└──────────────────────────────────────────────────────────────────────────────┘
```

<div align="center">
  <img src="/public/demo.png" alt="Interactive Demo" width="600"/>
</div>

## 🎨 UI/UX Features

### Color Scheme
KuttAI uses a beautiful gradient color scheme inspired by modern design principles:

- 🔵 **Blue** (#1a237e → #1565c0): Information and system messages
- 🔴 **Red** (#b71c1c → #d32f2f): Errors and important notices
- 🟡 **Yellow** (#f57f17 → #fbc02d): Warnings and highlights
- 🟢 **Green** (#1b5e20 → #388e3c): Success messages and positive feedback

### Animations & Effects
- **Loading animations** with spinning indicators
- **Progress bars** for model loading and long operations
- **Typewriter effect** for response display
- **Smooth transitions** between application states
- **Real-time typing indicators**


## 🔧 Technical Architecture

### Built With
- **Node.js** - Runtime environment
- **LLama.cpp** - AI model integration via node-llama-cpp
- **Custom UI Engine** - Terminal interface rendering with blessed
- **Local Storage** - Data persistence with JSON files

### Model Information
KuttAI uses optimized AI models specifically trained for academic content:

- **Model**: hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf
- **Size**: Approximately 2B parameters
- **Specialization**: Educational content, KTU curriculum
- **Download Size**: ~1.5GB
- **RAM Usage**: ~4GB during operation


## 🤝 Contributing

We love contributions! Here's how you can help:

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/cyberkutti-iedc/kuttai.git
cd kuttai

# Install dependencies
npm install

# Set up development environment
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Contribution Areas
- 🐛 Bug fixes and issue resolution
- 💡 New feature implementation
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🔧 Performance optimizations

Please read our [Contributing Guidelines](./docs/Contributing.md) for more details.



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Developed by [EcoCee](https://ecocee.in)
- Inspired by the needs of KTU students
- Built with the amazing Node.js ecosystem
- Thanks to all contributors and testers


## 📞 Support

### Documentation
- 📖 [User Guide](https://ecocee.in/kuttai)

### Contact
- 📧 Email: info@ecocee.in
- 🐛 [GitHub Issues](https://github.com/cyberkutti-iedc/kuttai/issues)
- 💬 [Discord Community](https://discord.gg/ecocee)

### Troubleshooting

**Common Issues and Solutions:**

1. **Model Download Failed**
   ```bash
   # Manual download option
   npx --no node-llama-cpp pull --dir ./models <model-file-url>
   ```

2. **Insufficient Memory**
   - Close other applications
   - Add swap space (Linux/macOS)

3. **Node Version Issues**
   ```bash
   # Update Node.js
   nvm install 18
   nvm use 18
   ```

4. **Display Problems**
   - Ensure your terminal supports ANSI colors
   - Try using a different terminal emulator


## 🔮 Roadmap

### Upcoming Features
- [ ] **Voice Interaction** - Speak to KuttAI and hear responses
- [ ] **Multi-language Support** - Assistance in Malayalam and Hindi
- [ ] **Mobile App** - KuttAI on your smartphone
- [ ] **Plugin System** - Extend functionality with community plugins
- [ ] **Cloud Sync** - Sync your preferences across devices
- [ ] **Advanced Study Planner** - Intelligent study schedule generator

### Current Version: v1.0.0
- ✅ Beautiful terminal UI with colors and animations
- ✅ Local AI model integration
- ✅ KTU-specific knowledge base
- ✅ Student profile system
- ✅ Conversation history

<div align="center">
  
---

**Made with ❤️ by [EcoCee Innovation Hub](https://ecocee.in)**

![KuttAI Logo](https://img.shields.io/badge/KuttAI-Your%20Study%20Companion-blue?style=for-the-badge)

[![Website](https://img.shields.io/badge/Visit-Our%20Website-1a237e?style=flat-square&logo=google-chrome)](https://ecocee.in)
[![Twitter](https://img.shields.io/badge/Follow-Twitter-1da1f2?style=flat-square&logo=twitter)](https://twitter.com/ecocee_in)
[![Instagram](https://img.shields.io/badge/Follow-Instagram-e4405f?style=flat-square&logo=instagram)](https://instagram.com/ecocee_in)

</div>
