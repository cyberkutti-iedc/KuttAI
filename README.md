# KuttAI CLI

![KuttAI Banner](https://img.shields.io/badge/KuttAI-Chatbot-blue?style=for-the-badge&logo=ai)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A beautiful, modern command-line interface AI chatbot designed specifically for KTU students. KuttAI provides intelligent assistance for studies, exams, and all things related to the KTU ecosystem.

## ✨ Features

- **🎨 Beautiful UI**: Gradient-colored interface with blue, red, yellow, and green themes
- **⚡ Real-time Responses**: Fast AI-powered answers to your academic questions
- **📚 KTU-Focused**: Specialized knowledge for KTU curriculum and resources
- **🔒 Privacy First**: All data stored locally on your machine
- **🎯 Smart Context**: Understands context from previous conversations
- **📊 System Integration**: Displays relevant system information

## 🚀 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Setup
```bash
# Clone the repository
git clone https://github.com/cyberkutti-iedc/kuttai.git

# Navigate to the project directory
cd kuttai-cli

# Install dependencies
npm install

# Start KuttAI
npm start
```

## 🎮 Usage

### Starting KuttAI
```bash
node index.js
```

### Basic Commands
- Just type your question to get answers about studies, exams, or KTU
- `/profile` - Set up your student profile
- `/help` - See all available commands
- `/about` - Learn more about KuttAI
- `Ctrl+C` - Exit the application

### Example Interactions
```
You: What are the important topics for CS2040?
KuttAI: Based on the current syllabus, the important topics for CS2040 include...

You: When is the S4 CSE end semester exam?
KuttAI: The S4 CSE end semester exams are scheduled for...
```

## 🎨 UI Features

### Colorful Interface
KuttAI uses a beautiful gradient color scheme inspired by Google's design:
- 🔵 Blue for information and system messages
- 🔴 Red for errors and important notices
- 🟡 Yellow for warnings and highlights
- 🟢 Green for success messages and positive feedback

### Animations
- Loading animations with spinning indicators
- Progress bars for long operations
- Typewriter effect for response display
- Smooth transitions between states

## 🔧 Technical Details

### Built With
- **Node.js** - Runtime environment
- **LLama.cpp** - AI model integration
- **Custom UI Engine** - Terminal interface rendering
- **Local Storage** - Data persistence

### System Requirements
- Operating System: Windows, macOS, or Linux
- RAM: Minimum 4GB (8GB recommended for optimal performance)
- Storage: 500MB free space for models and data

### Model Information
KuttAI uses optimized AI models specifically trained for academic content:
- Model: hf_mradermacher_ClinIQ-Gemma-2B-v0-hf.IQ4_XS.gguf
- Size: Approximately 2B parameters
- Specialization: Educational content, KTU curriculum

## 🤝 Contributing

We welcome contributions to KuttAI! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Install development dependencies
npm install --dev

# Run in development mode
npm run dev

# Run tests
npm test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Developed by [EcoCee](https://ecocee.in)
- Inspired by the needs of KTU students
- Built with the amazing Node.js ecosystem
- Thanks to all contributors and testers

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section below
2. Search existing [GitHub Issues](https://github.com/cyberkutti-iedc/kuttai/issues)
3. Create a new issue with detailed information

### Troubleshooting

**Common Issues:**
1. **Model loading errors**: Ensure you have the latest version of node-llama-cpp
   ```bash
   npm install node-llama-cpp@latest
   ```

2. **Performance issues**: Close other memory-intensive applications

3. **Display problems**: Ensure your terminal supports ANSI color codes

4. **Node version errors**: Update to Node.js 18 or higher

**Getting Help:**
- Documentation: [https://ecocee.in/kuttai](https://ecocee.in/kuttai)
- Email: info@ecocee.in
- GitHub Issues: [Report a bug](https://github.com/cyberkutti-iedc/kuttai/issues/new)

## 🔮 Roadmap

- [ ] Voice interaction support
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Plugin system for extended functionality
- [ ] Cloud sync for preferences across devices
- [ ] Advanced study planner integration

---

<div align="center">
  
Made with ❤️ by [EcoCee](https://ecocee.in)

![KuttAI Logo](https://img.shields.io/badge/KuttAI-Your%20Study%20Companion-blue?style=for-the-badge)

</div>
